import Portfolio from "../model/portfolio.model.js";
import { cloudinaryUpload } from "../utility/cloudinary.js";
import { multer_setup } from "../utility/cloudinary.js";
import streamifier from "streamifier";
export const update_profilePic = async (req, res) => {
    const username = req.params.username;

    // Find the user by username
    const user = await Portfolio.findOne({ username: username });
    if (!user) {
        return res.status(404).json({ error: "Portfolio not found" });
    }

    // Set up Multer middleware
    const upload = multer_setup(username);
            const previousPic = user.profilePic;
            if (previousPic) {
              //  console.log("Deleting previous profile picture from Cloudinary:", previousPic);
                const urlParts = previousPic.split("/");
                const public_id = urlParts[urlParts.length - 1].split(".")[0];

                // Add the folder to the public_id if it exists
                const folder = urlParts[urlParts.length - 2];
                const fullPublicId = folder ? `${folder}/${public_id}` : public_id;
              const deleted_pic=  await cloudinaryUpload.uploader.destroy(fullPublicId);
              console.log("Deleted profile picture from Cloudinary:", deleted_pic);
            }
    // Use Multer middleware to handle file upload
    upload.single("profilePic")(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        try {

            if (!req.file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            
            const stream = cloudinaryUpload.uploader.upload_stream(
                { folder: "portfolio" },
                async (error, result) => {
                    if (error) {
                        console.error("Error uploading file:", error);
                        return res.status(500).json({ message: "Error uploading file", error });
                    }

                    // Update the user's profile picture in the database
                    await Portfolio.updateOne(
                        { username: username },
                        { $set: { profilePic: result.secure_url } }
                    );

                    // Return success response
                    res.json({ message: "Profile pic updated!", imageUrl: result.secure_url });
                }
            );

            // Stream the file buffer to Cloudinary
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: error.message });
        }
    });
};
export const update_name=async (req, res) => {
    const username = req.params.username;
    const user= await Portfolio.findOne({username:username});    
    if(!user){
        return res.status(404).json({error:"Portfolio not found"})
    }
    const { name } = req.body;
    await Portfolio.updateOne({username:username}, { $set: { name } });
    res.json({ message: "Name updated!" });
    }
export const update_about=async (req, res) => {
    const username = req.params.username;
    const user= await Portfolio.findOne({username:username});
    if(!user){
        return res.status(404).json({error:"Portfolio not found"})
    }
    const { about } = req.body;
    await Portfolio.updateOne({username:username}, { $set: { about } });
    res.json({ message: "About updated!" });
}
export const update_resume=async (req, res) => {
     const username = req.params.username;
     const user= await Portfolio.findOne({username:username});
     if(!user){
        return res.status(404).json({error:"Portfolio not found"})
     }
    const { resume } = req.body;
    await Portfolio.updateOne({username:username}, { $set: { resume } });
    res.json({ message: "Resume updated!" });
}
export const add_skill= async (req, res) => {
     const username = req.params.username;
     const user= await Portfolio.findOne({username:username});
     if(!user){
        return res.status(404).json({error:"Portfolio not found"})
     }
    const { skill } = req.body;
    await Portfolio.updateOne({username:username}, { $push: { skills: skill } });
    res.json({ message: "Skill added!" });
}
export const delete_skill =async (req, res) => {
     const username = req.params.username;
     const user= await Portfolio.findOne({username:username});
     if(!user){
        return res.status(404).json({error:"Portfolio not found"})
     }
    const {skill} = req.body;
    if (!skill) {
        return res.status(400).json({ message: "Skill is required!" });
    }
    await Portfolio.updateOne({username:username}, { $pull: { skills: skill } });
    res.json({ message: "Skill removed!" });
}
export const add_project = async (req, res) => {
     const username = req.params.username;
     const user= await Portfolio.findOne({username:username});
     if(!user){
        return res.status(404).json({error:"Portfolio not found"})
     }
    const { title, description, imageUrl, link } = req.body;
    if (!title || !description ) {
        return res.status(400).json({ message: "All fields are required!" });
    }
    const newProject = { title, description, imageUrl, link};
    await Portfolio.updateOne({username:username}, { $push: { projects: newProject } });
    res.json({ message: "Project added!" });
}
export const delete_project=async (req,res)=>{
    const username=req.params.username;
    const user = await Portfolio.findOne({
        username: username
    });    
    if(!user){
        return res.status(404).json({error:"Portfolio not found"})
    }
    const {index} = req.body;
    if(index===null || index===undefined){
        return res.status(400).json({error:"index is required"})
    }
    if(index<0 || index>=user.projects.length){
        return res.status(400).json({error:"Index out of range"})
    }
    const to_delete=user.projects[index];
    await Portfolio.updateOne({username:username}, { $pull: { projects: to_delete } });
    res.json({message:"Project deleted!"})
}
export const set_portfolio = async (req, res) => {       
    const { username,name, resume, profilePic, about, skills, projects, experience, education ,leetcode_id,gfg_id, email,instagram,twitter} = req.body;
    const find_username= await Portfolio.findOne({username:username});
    if(find_username){
        return res.status(501).json({error:"Portfolio already exist with this username kindly choose another username"})
    }
    const find_email= await Portfolio.findOne({email:email});
    if(find_email){
        return res.status(501).json({error:"Email already exist with another portfolio"})
    }
    const newPortfolio = new Portfolio({ username, resume, profilePic, about, skills, projects, experience, education,leetcode_id,gfg_id ,email,name,instagram,twitter});
    // await Portfolio.deleteMany({});      // Delete all existing portfolios
    await newPortfolio.save();
    res.json({ message: "Portfolio set!" });
}
export const delete_portfolio= async (req,res)=>{
    const username=req.params.username;
    const user = await Portfolio.findOne({username:username});
    if(!user){
        return res.status(404).json({error:"Portfolio not found"})
    }
    await Portfolio.deleteOne({username:username});
    res.json({message:"Portfolio deleted!"})
}
export const get_portfolio = async (req, res) => {
    const username = req.params.username;
    const user = await Portfolio.findOne({username:username});
    if(!user){
        return res.status(404).json({error:"Portfolio not found"})
    }
    res.json(user);
}
export const add_experience = async (req, res) => {
     const username = req.params.username;
     const user= await Portfolio.findOne({username:username});
     if(!user){
        return res.status(404).json({error:"Portfolio not found"})
     }
    const { company,position,startDate,endDate, description,imageUrl } = req.body;
    if (!company || !position || !startDate  || !description ) {
        return res.status(400).json({ message: "All fields are required!" });
    }
    const newExperience = { company,position,startDate,endDate, description,imageUrl };
    await Portfolio.updateOne({username:username}, { $push: { experience: newExperience } });
    res.json({ message: "experience added!" });
}
export const delete_experience=async (req,res)=>{
    const username=req.params.username;
    const user = await Portfolio.findOne({
        username: username
    });    
    if(!user){
        return res.status(404).json({error:"Portfolio not found"})
    }
    const {index} = req.body;
    if(index===null || index===undefined){
        return res.status(400).json({error:"index is required"})
    }
    if(index<0 || index>=user.experience.length){
        return res.status(400).json({error:"Index out of range"})
    }
    const to_delete=user.experience[index];
    await Portfolio.updateOne({username:username}, { $pull: { experience: to_delete } });
    res.json({message:"experience deleted!"})
}

export const add_education = async (req, res) => {
     const username = req.params.username;
     const user= await Portfolio.findOne({username:username});
     if(!user){
        return res.status(404).json({error:"Portfolio not found"})
     }
    const {institution,degree,startDate,endDate,marks ,imageUrl} = req.body;
    if (!institution || !degree ) {
        return res.status(400).json({ message: "institution and degree fields are required!" });
    }
    const newEducation = { institution,degree,startDate,endDate,marks,imageUrl };
    await Portfolio.updateOne({username:username}, { $push: { education: newEducation } });
    res.json({ message: "education added!" });
}
export const delete_education=async (req,res)=>{
    const username=req.params.username;
    const user = await Portfolio.findOne({
        username: username
    });    
    if(!user){
        return res.status(404).json({error:"Portfolio not found"})
    }
    const {index} = req.body;
    if(index===null || index===undefined){
        return res.status(400).json({error:"index is required"})
    }
    if(index<0 || index>=user.education.length){
        return res.status(400).json({error:"Index out of range"})
    }
    const to_delete=user.education[index];
    await Portfolio.updateOne({username:username}, { $pull: { education: to_delete } });
    res.json({message:"education deleted!"})
}
export const update_leetcode =async (req,res)=>{
    const username=req.params.username;
    const user = await Portfolio.findOne({
        username: username
    });    
    if(!user){
        return res.status(404).json({error:"Portfolio not found"})
    }
    const {leetcode_id} = req.body;
    if(leetcode_id===null || leetcode_id===undefined){
        return res.status(400).json({error:"leetcode is required"})
    }
    await Portfolio.updateOne({username:username}, { $set: { leetcode_id: leetcode_id } });
    res.json({message:"leetcode updated!"})
}
export const update_gfg =async (req,res)=>{
    const username=req.params.username;
    const user = await Portfolio.findOne({
        username: username
    });    
    if(!user){
        return res.status(404).json({error:"Portfolio not found"})
    }
    const {gfg_id} = req.body;
    if(gfg_id===null || gfg_id===undefined){
        return res.status(400).json({error:"gfg is required"})  
    }
    await Portfolio.updateOne({username:username}, { $set: { gfg_id: gfg_id } });
    return res.json({message:"gfg updated!"})   
}
export const update_linkedin =async (req,res)=>{
    const username=req.params.username;
    const user = await Portfolio.findOne({
        username: username
    });    
    if(!user){
        return res.status(404).json({error:"Portfolio not found"})
    }
    const {linkedin} = req.body;
    if(linkedin===null || linkedin===undefined){
        return res.status(400).json({error:"linkedin is required"})
    }
    await Portfolio.updateOne({username:username}, { $set: { linkedin: linkedin } });
    res.json({message:"linkedin updated!"})
    }
export const update_github =async (req,res)=>{
    const username=req.params.username;
    const user = await Portfolio.findOne({
        username: username
    });    
    if(!user){
        return res.status(404).json({error:"Portfolio not found"})
    }    
    const {github} = req.body;    
    if(github===null || github===undefined){
        return res.status(400).json({error:"github is required"})
    }
    await Portfolio.updateOne({username:username}, { $set: { github: github } });
    res.json({message:"github updated!"})
}
export const update_instagram =async (req,res)=>{
    const username=req.params.username;
    const user = await Portfolio.findOne({
        username: username
    });    
    if(!user){
        return res.status(404).json({error:"Portfolio not found"})
    }
    const {instagram} = req.body;
    if(instagram===null || instagram===undefined){
        return res.status(400).json({error:"instagram is required"})
    }
    await Portfolio.updateOne({username:username}, { $set: { instagram: instagram } });
    res.json({message:"instagram updated!"})
}
export const update_twitter =async (req,res)=>{
    const username=req.params.username;
    const user = await Portfolio.findOne({
        username: username
    });    
    if(!user){
        return res.status(404).json({error:"Portfolio not found"})
    }
    const {twitter} = req.body;
    if(twitter===null || twitter===undefined){
        return res.status(400).json({error:"twitter is required"})
    }
    await Portfolio.updateOne({username:username}, { $set: { twitter: twitter } });
    res.json({message:"twitter updated!"})
}
export const update_email =async (req,res)=>{
    const username=req.params.username;
    const user = await Portfolio.findOne({
        username: username
    });    
    if(!user){
        return res.status(404).json({error:"Portfolio not found"})
    }
    const {email} = req.body;
    if(email===null || email===undefined){
        return res.status(400).json({error:"email is required"})
    }
    await Portfolio.updateOne({username:username}, { $set: { email: email } });
    res.json({message:"email updated!"})
}
export const website_link=async (req,res)=>{
    const user=await Portfolio.findOne({username:"kunalgambhir920"});
    if(!user){
        return res.status(404).json({error:"Website link not found"})
    }
const web_link=user.resume;
return res.json(web_link);
}
