import express from 'express';
const app= express();
import bodyparser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
app.use(bodyparser.json());
import db from './db.js';
import cors from 'cors';
app.use(cors());
import portfoliorouter from './router/portfolio.router.js';
import datarouter from './router/data.router.js';
app.get('/',(req,res)=>{
    res.send("Hello World");
})
app.use('/data',datarouter);
app.use('/portfolio',portfoliorouter);
app.listen(process.env.PORT,()=>{
    console.log("app is running on port ", process.env.PORT)
})