import mongoose from "mongoose";
const PortfolioSchema = new mongoose.Schema({
    username:String,
    name: String,
    resume: String, // Resume link
    profilePic:String , // Cloudinary URL
    about: String,
    linkedin: String,
    github: String,
    skills: [String], // ["React", "Node.js", "MongoDB"]
    projects: [
        {
            title: {type:String},
            description: String,
            imageUrl: {
                type: String,
                
            },
            link: String
        }
    ],
    instagram: String,
    twitter: String,
    experience: [
        {
            company: String,
            position: String,
            startDate: Date,
            endDate: Date,
            description: String,
            imageUrl: {
                type: String
            
            }
        }
    ],
    education: [
        {
            institution: String,
            degree: String,
            startDate: Date,
            endDate: Date,
            imageUrl: {
                type: String
            },
            marks:String
        }
    ],
    messages:[
        {
            name:String,
            mail:String,
            msg:String,
            date:{
                type:Date,
                default:Date.now+ (5 * 60 + 30) * 60 * 1000;
            }
        }
    ],
    leetcode_id:String,
    gfg_id:String,
    email:{
        type:String,
        required:true
    }
});

 const Portfolio = mongoose.model("Portfolio", PortfolioSchema);
 export default Portfolio;
