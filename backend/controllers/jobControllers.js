import {Job} from "../models/jobSchema.js";

export const postJob = async(req,res,next) =>{
    try{
        const {
            title,
            jobType,
            companyName,
            location,
            responsibilities,
            qualifications,
            offers,
            description,
            salary,
            personalWebSiteTitle,
            personalWebSiteUrl,
            jobNiche,
            openings,
            NotificationSent,
            hiringProcess,  
            experience,
            jobPostedOn,
            } = req.body;
        
        if(
            !title||
            !jobType||
            !companyName||
            !location||
            !responsibilities||
            !qualifications||
            !description||
            !salary||
            !jobNiche||
            !openings||
            !hiringProcess||
            !experience
            ){
                return res.status(400).json({
                    message:"Please provide full job details",
                    success:false
                });
            }
            if((personalWebSiteTitle && !personalWebSiteUrl) || (!personalWebSiteTitle && personalWebSiteUrl)){
                return res.status(400).json({
                    message:"Provide both the website url and title, or leave both blank.",
                    success:false
                })
            }
            // job postedBY
            const postedBy = req.user;
            const job = await Job.create({
            title,
            jobType,
            companyName,
            location,
            qualifications,
            responsibilities,
            offers,
            NotificationSent,
            description,
            salary: Number(salary),
            personalWebSite:{
                title:personalWebSiteTitle,
                url:personalWebSiteUrl,
            },
            jobNiche,
            openings,
            hiringProcess,
            experience,
            postedBy,
            jobPostedOn,
            });
            console.log(job);   
            return res.status(201).json({
                message:"New job posted Successfully",
                success:true
            })
    }catch(error){
        console.log(error);
    }

}

export const getAllJobs = async(req,res) =>{
    const {city,niche, searchKey} = req.query;
    const query = {};
    if(city){
        query.location = {$regex: city, $options:"i"};
    }
    if(niche){
        query.niche = {$regex:niche, $options:"i"};    
    }
    if(searchKey){
        query.$or = [
            {
                title:{$regex:searchKey, $options:"i"}
            },
            {
                companyName:{$regex:searchKey, $options:"i"}
            },
            {
                description:{$regex:searchKey,$options:"i"}
            }
        ]
    }
    const jobs = await Job.find(query);
    return res.status(200).json({
        success:true,
        jobs,
        leng: jobs.length
    })
}
export const getMyJobs = async(req,res,next) =>{
    
    const myJobs = await Job.find({ postedBy: req.user });
    // console.log(req.user._id);
    return res.status(200).json({
        success:true,
        myJobs,
        len: myJobs.length
    });
}
export const deleteJob = async(req,res,) =>{
   try{
    const {id} = req.params;
    const job = await Job.findById(id);
    if(!job){
        return res.status(404).json({
            message:"job is not Found",
            success:false
        });
    }
    await job.deleteOne();
    return res.status(200).json({
        message:"job deleted successfully",
        success:true
    });
   }catch(error){
     console.log(error);
   }
}


export const getSingleJob = async(req,res) =>{
    
        const {id} = req.params;
        const job  = await Job.findById(id);
        if(!job){
            return res.status(404).json({
                message:"job is not Found",
                success:false
            });
        }
        return res.status(200).json({
            job,
            success:true
        });
}

