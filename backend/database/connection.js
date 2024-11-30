import mongoose from "mongoose";

const connectionDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            dbName: "JOB_PORTAL_WITH_AUTOMATION"});
        console.log("mongodb connected successfully.");
    }catch(error){
        console.log(`Some error occured while connecting to database: ${error}`);
    }
}
export default connectionDB;