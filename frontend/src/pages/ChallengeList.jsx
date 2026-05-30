import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Code2, Zap, ChevronRight, CheckCircle, Star } from "lucide-react";
import axios from "axios";

const difficultyColor = {
  Easy: "text-green-400 bg-green-400/10",
  Medium: "text-yellow-400 bg-yellow-400/10",
  Hard: "text-red-400 bg-red-400/10",
};

const ChallengeList = () => {
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const origin = window.location.port === "5173" ? "http://localhost:5000" : window.location.origin;
    axios.get(`${origin}/api/challenges`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setChallenges(res.data.challenges || []))
    .catch(() => {
      setChallenges([
        { _id: "1", title: "Two Sum", difficulty: "Easy", tags: ["Array", "Hash Map"], acceptanceRate: 72 },
        { _id: "2", title: "Reverse a String", difficulty: "Easy", tags: ["String"], acceptanceRate: 85 },
        { _id: "3", title: "Binary Search", difficulty: "Medium", tags: ["Array", "Binary Search"], acceptanceRate: 61 },
        { _id: "4", title: "Valid Parentheses", difficulty: "Easy", tags: ["Stack"], acceptanceRate: 78 },
        { _id: "5", title: "Merge Intervals", difficulty: "Medium", tags: ["Array", "Sorting"], acceptanceRate: 45 },
        { _id: "6", title: "LRU Cache", difficulty: "Hard", tags: ["Design", "Hash Map"], acceptanceRate: 38 },
      ]);
    });
  }, []);

  const filtered = filter === "All" ? challenges : challenges.filter(c => c.difficulty === filter);

  return (
    <motion.main
      className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Code2 className="w-8 h-8 text-indigo-400" />
            Coding Challenges
          </h1>
          <p className="text-gray-400 mt-1">Sharpen your skills. Solve, learn, grow.</p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          {["All", "Easy", "Medium", "Hard"].map(d => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${filter === d ? "bg-indigo-600 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Challenge List */}
        <div className="space-y-3">
          {filtered.map((ch, i) => (
            <motion.div
              key={ch._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 4 }}
              onClick={() => navigate(`/challenge/${ch._id}`)}
              className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 cursor-pointer transition group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center font-bold text-indigo-400">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-indigo-300 transition">{ch.title}</h3>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {ch.tags?.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center hidden sm:block">
                  <p className="text-xs text-gray-500">Acceptance</p>
                  <p className="font-semibold text-white">{ch.acceptanceRate || "—"}%</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${difficultyColor[ch.difficulty] || "text-gray-400 bg-gray-400/10"}`}>
                  {ch.difficulty}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-indigo-400 transition" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.main>
  );
};

export default ChallengeList;
