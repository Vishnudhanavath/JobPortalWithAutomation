import crons from "node-cron";
import {User} from "../models/userSchema.js";
import {Job} from "../models/jobSchema.js";
import { sendEmail } from "../sendEmail/sendEmail.js";

export const notificationCron = async() =>{
    crons.schedule("*/1 * * * *", async() =>{
        
        const jobs = await Job.find({notificationSent:false});
        for(const job of jobs){
            try{ 
                // findthe user which matches with the job niches and user niches;
                const filteredUser = await User.find({
                    $or:[
                        {"niches.firstNiche": job.jobNiche},
                        {"niches.secondNiche": job.jobNiche},
                        {"niches.thirdNiche": job.jobNiche}, 
                    ]
                    
                });
                // now sending email to each  jobseeker; 
                
                for(const user of filteredUser){
                    const subject = `Exciting Job Opportunity: ${job.title} at ${job.companyName}`;
                    const message = `
                    Hi ${user.fullName},

                        We have an exciting job opportunity that matches your interests!

                        Job Title: ${job.title}
                        Company: ${job.companyName}
                        Location: ${job.location}
                        Job Type: ${job.jobType}
                        Salary: ${job.salary ? `${job.salary} per annum` : 'Not disclosed'}

                        Job Description:
                        ${job.description}

                        Responsibilities:
                        ${job.responsibilities}

                        Qualifications Required:
                        ${job.qualifications}

                        Apply now to kickstart your career with this amazing opportunity.

                        Best regards,
                        The Job Portal Team
                        `;
                    console.log(user.email);
                    console.log("Task running in every 1 minute");
                    sendEmail({
                        email:user.email,
                        subject,
                        message,
                    })
                }  
                job.notificationSent = true;
                await job.save();
            }catch(error){
            console.log(error.message);
            }

        }
    });
    

}


