// creating server
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectionDB from "./database/connection.js";
import userRoute  from "./Routes/userRoute.js";
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";
import jobRoute from "./Routes/jobRoute.js";
import applicationRoute from "./Routes/applicationRoute.js";
import { notificationCron } from "./automation/NotificationCron.js";
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

dotenv.config({});
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  
app.use(cookieParser());


const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
};
app.use(cors(corsOptions));


app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
);


//api's
notificationCron();
app.use("/api/v1/user",userRoute);
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/applications",applicationRoute);

app.listen(process.env.PORT, () => {
    connectionDB();
    console.log(`Server is running at port: ${process.env.PORT}`);  
});
