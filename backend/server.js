// Import necessary libraries
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectionDB from "./database/connection.js";
import userRoute from "./Routes/userRoute.js";
import jobRoute from "./Routes/jobRoute.js";
import applicationRoute from "./Routes/applicationRoute.js";
import { notificationCron } from "./automation/NotificationCron.js";
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";
import nodemailer from "nodemailer";


dotenv.config();


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// cloudinary.v2.uploader.upload(
//   "https://res.cloudinary.com/demo/image/upload/sample.jpg",
//   { folder: "test" },
//   (error, result) => {
//     if (error) {
//       console.error("Cloudinary Test Error:", error);
//     } else {
//       console.log("Cloudinary Test Success:", result.secure_url);
//     }
//   }
// );

// Initialize the server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable CORS
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
    debug: true, 
  })
);

// Test SMTP Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  service: process.env.SMTP_SERVICE,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.sendMail(
  {
    from: process.env.SMTP_MAIL,
    to: "test@example.com", // Change to a valid email for testing
    subject: "SMTP Test Email",
    text: "This is a test email to verify SMTP setup.",
  },
  (error, info) => {
    if (error) {
      console.error("SMTP Test Error:", error);
    } else {
      console.log("SMTP Test Success:", info.response);
    }
  }
);

// API Routes
notificationCron();
app.use("/api/v1/user", userRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/applications", applicationRoute);

// Start the server
app.listen(process.env.PORT, () => {
  connectionDB(); 
  console.log(`Server is running at port: ${process.env.PORT}`);
});
