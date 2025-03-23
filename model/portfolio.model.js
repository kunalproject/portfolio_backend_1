import mongoose from "mongoose";
const PortfolioSchema = new mongoose.Schema({
    username:String,
    name: String,
    resume: String, // Resume link
    profilePic: {type:String ,default: "https://res.cloudinary.com/dmmwlsock/image/upload/v1742511312/portfolio/jd16vkexyn6q64ooltg5.jpg"}, // Cloudinary URL
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
                default:"https://res.cloudinary.com/dmmwlsock/image/upload/v1742555588/portfolio/go2x0zwitrst7vtnp1ne.png"
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
                type: String,
                default:"https://res.cloudinary.com/dmmwlsock/image/upload/v1742704323/portfolio/sbt1ebmtvim89f5qcjwl.jpg"
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
                type: String,
                default:"https://res.cloudinary.com/dmmwlsock/image/upload/v1742704062/portfolio/dntqohn5gtm8k7qcutmj.jpg"
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
                default:Date.now
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