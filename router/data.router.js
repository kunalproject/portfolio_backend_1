import express from 'express';
const router=express.Router();
import { send_data } from '../controllers/send_data.controller.js';
import { dsa_stats } from '../controllers/stats.controller.js';
router.get("/dsa_stats/:username",dsa_stats);
router.post('/send_msg/:username',send_data);
export default router;