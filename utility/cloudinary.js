import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});
export const cloudinaryUpload = cloudinary;

export const multer_setup=(username)=>{
const imgconfig = multer.memoryStorage();

// img filter
const isImage = (req,file,callback)=>{
    if(file.mimetype.startsWith("image")){
        callback(null,true)
    }else{
        callback(new Error("only images is allow"))
    }
}


const upload = multer({
    storage:imgconfig,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    }, 
    fileFilter:isImage
})
 return upload;
}
