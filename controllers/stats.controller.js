import axios from "axios";
import Portfolio from "../model/portfolio.model.js";

export const dsa_stats = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await Portfolio.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    const gfg_id = user.gfg_id;
    const leetcode_id = user.leetcode_id;

    const dsa_stats = {
      totalsolved: 0,
      easy: 0,
      medium: 0,
      hard: 0,
    };

    // Fetch LeetCode Stats
    if (!leetcode_id) {
      await getLeetCodeStats(leetcode_id, dsa_stats);
    }

    // Fetch GFG Stats
    if (gfg_id) {
      await getGFGStats(gfg_id, dsa_stats);
    }

    res.json((!gfg_id && !leetcode_id) ? { stats: null } : { stats: dsa_stats });

  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Error fetching data");
  }
};

// LeetCode Stats Function
async function getLeetCodeStats(leetcode_id, dsa_stats) {
  try {
    const query = `
      query {
        matchedUser(username: "${leetcode_id}") {
          username
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    const response = await axios.post(
      "https://leetcode.com/graphql",
      { query },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const statsArray = response.data.data?.matchedUser?.submitStats?.acSubmissionNum;

    if (statsArray) {
      for (const { difficulty, count } of statsArray) {
        if (difficulty === "Easy") dsa_stats.easy += count;
        else if (difficulty === "Medium") dsa_stats.medium += count;
        else if (difficulty === "Hard") dsa_stats.hard += count;
        else if (difficulty === "All") dsa_stats.totalsolved += count;
      }
    }
  } catch (error) {
    console.error("LeetCode API error:", error.message);
  }
}

// GFG Stats Function
async function getGFGStats(gfg_id, dsa_stats) {
  try {
    const response = await fetch(`https://geeks-for-geeks-api.vercel.app/${gfg_id}`);
    const gfgData = await response.json();

    dsa_stats.totalsolved += gfgData.info?.totalProblemsSolved || 0;
    dsa_stats.easy +=
      (gfgData.solvedStats?.easy?.count || 0) +
      (gfgData.solvedStats?.basic?.count || 0) +
      (gfgData.solvedStats?.school?.count || 0);
    dsa_stats.medium += gfgData.solvedStats?.medium?.count || 0;
    dsa_stats.hard += gfgData.solvedStats?.hard?.count || 0;
  } catch (error) {
    console.error("GFG API error:", error.message);
  }
}

