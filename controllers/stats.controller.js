import Portfolio from "../model/portfolio.model.js";

export const dsa_stats=async (req,res)=>{
try {
        const username=req.params.username;
        const user= await Portfolio.findOne({username:username});
        if(!user){
            return res.status(404).json({error:"Portfolio not found"})    
        }

        const gfg_id=user.gfg_id ;
        const leetcode_id=user.leetcode_id ;
        const dsa_stats={
            totalsolved:0,
            easy:0,
            medium:0,
            hard:0
        };
        // if(gfg_id){
        //     try{
        //     const gfg_response = await fetch("https://geeks-for-geeks-api.vercel.app/"+gfg_id);
        //     const gfg_obj = await gfg_response.json();
        //     dsa_stats.totalsolved=gfg_obj.info.totalProblemsSolved;
        //     dsa_stats.easy=gfg_obj.solvedStats.easy.count+gfg_obj.solvedStats.basic.count+gfg_obj.solvedStats.school.count;
        //     dsa_stats.medium=gfg_obj.solvedStats.medium.count;
        //     dsa_stats.hard=gfg_obj.solvedStats.hard.count;
        //     }
        //     catch(error){
        //     }
        // }
        if(leetcode_id){
            try{
                const leetcode_response =await fetch("https://leetcode-api-faisalshohag.vercel.app/"+leetcode_id);
            const leetcode_obj = await leetcode_response.json();
            if(! leetcode_obj.errors){
            dsa_stats.totalsolved+=leetcode_obj.totalSolved;
            dsa_stats.easy+=leetcode_obj.easySolved;
            dsa_stats.medium+=leetcode_obj.mediumSolved;
            dsa_stats.hard+=leetcode_obj.hardSolved;   
            }
         
            }
            catch(error){
            }
        }

        res.json((!gfg_id && !leetcode_id)?{"stats":null}:{ "stats":dsa_stats});
    } catch (error) {
        // console.error("Error fetching data:", error);
        res.status(500).send("Error fetching data");
    }
}
