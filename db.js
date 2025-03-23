import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const atlasUrl = process.env.ATLAS_URL ;
mongoose.connect(atlasUrl)
const db=mongoose.connection
db.on('connected',()=>{
    console.log("connection establish with data base");
})
db.on('disconnect',()=>{
console.log("connect has been disconnected with data base")
}
)
export default db;
