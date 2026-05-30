import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import { Play, Send, RotateCcw, ChevronDown, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import axios from "axios";

const LANGUAGES = ["javascript", "python", "java", "cpp"];

const DEFAULT_CODE = {
  javascript: `// Write your solution here
function solution(nums, target) {
  // Your code here
}`,
  python: `# Write your solution here
def solution(nums, target):
    # Your code here
    pass`,
  java: `// Write your solution here
class Solution {
    public int[] solution(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
  cpp: `// Write your solution here
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`,
};

const CodingPlayground = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState(null); // null | 'running' | 'accepted' | 'wrong' | 'error'
  const [activeTab, setActiveTab] = useState("problem"); // 'problem' | 'submissions'
  const textareaRef = useRef(null);

  const origin = window.location.port === '5173' ? 'http://localhost:5000' : window.location.origin;

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${origin}/api/challenges/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const ch = res.data.challenge || res.data;
      // Map testCases to examples for display
      if (ch.testCases && !ch.examples) {
        ch.examples = ch.testCases.filter(tc => tc.isSample).map(tc => ({
          input: tc.input, output: tc.output
        }));
      }
      // Load language template if available
      if (ch.templates && ch.templates[language]) {
        setCode(ch.templates[language]);
      }
      setChallenge(ch);
    })
    .catch(() => {
      setChallenge({
        title: "Two Sum",
        difficulty: "Easy",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.",
        examples: [
          { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9" }
        ],
        constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists."]
      });
    });
  }, [id]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang]);
    setOutput("");
    setStatus(null);
  };

  const runCode = async () => {
    setStatus("running");
    setOutput("⏳ Running your code...");
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(`${origin}/api/challenges/${id}/submit`, { code, language }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOutput(res.data.output || "No output");
      setStatus("accepted");
    } catch (err) {
      setOutput(err.response?.data?.output || err.response?.data?.error || "Runtime error occurred.");
      setStatus("error");
    }
  };

  const submitCode = async () => {
    setStatus("running");
    setOutput("⏳ Submitting solution...");
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(`${origin}/api/challenges/${id}/submit`, { code, language }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus(res.data.passed ? "accepted" : "wrong");
      setOutput(res.data.output || (res.data.passed ? "All test cases passed! 🎉" : "Some test cases failed."));
    } catch (err) {
      setStatus("error");
      setOutput(err.response?.data?.error || "Submission failed.");
    }
  };

  const diffColor = { Easy: "text-green-400", Medium: "text-yellow-400", Hard: "text-red-400" };
  const statusConfig = {
    accepted: { icon: <CheckCircle2 className="w-4 h-4" />, color: "text-green-400", label: "Accepted" },
    wrong: { icon: <XCircle className="w-4 h-4" />, color: "text-red-400", label: "Wrong Answer" },
    error: { icon: <XCircle className="w-4 h-4" />, color: "text-orange-400", label: "Runtime Error" },
    running: { icon: <Loader2 className="w-4 h-4 animate-spin" />, color: "text-indigo-400", label: "Running..." },
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Left Panel - Problem */}
      <div className="w-[42%] flex flex-col border-r border-white/10 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-slate-900">
          {["problem", "submissions"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition ${activeTab === tab ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-400 hover:text-white"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Problem Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold mb-2">{challenge?.title || "Loading..."}</h1>
            <span className={`text-sm font-semibold ${diffColor[challenge?.difficulty] || "text-gray-400"}`}>
              {challenge?.difficulty}
            </span>
          </div>

          {/* Description */}
          <div className="prose prose-invert text-gray-300 text-sm leading-relaxed mb-6">
            <p>{challenge?.description}</p>
          </div>

          {/* Examples */}
          {challenge?.examples?.map((ex, i) => (
            <div key={i} className="mb-4 bg-slate-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Example {i + 1}</p>
              <div className="space-y-1 text-sm font-mono">
                <p><span className="text-gray-400">Input: </span><span className="text-white">{ex.input}</span></p>
                <p><span className="text-gray-400">Output: </span><span className="text-green-400">{ex.output}</span></p>
                {ex.explanation && <p><span className="text-gray-400">Explanation: </span><span className="text-gray-300">{ex.explanation}</span></p>}
              </div>
            </div>
          ))}

          {/* Constraints */}
          {challenge?.constraints?.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Constraints</p>
              <ul className="space-y-1">
                {challenge.constraints.map((c, i) => (
                  <li key={i} className="text-sm text-gray-300 font-mono bg-slate-800 px-3 py-1.5 rounded">{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between bg-slate-900 border-b border-white/10 px-4 py-2">
          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={e => handleLanguageChange(e.target.value)}
              className="appearance-none bg-slate-800 text-white text-sm px-4 py-2 pr-8 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {LANGUAGES.map(l => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => { setCode(DEFAULT_CODE[language]); setOutput(""); setStatus(null); }}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
              title="Reset code"
            >
              <RotateCcw className="w-4 h-4 text-gray-400" />
            </button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={runCode}
              disabled={status === "running"}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              Run
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={submitCode}
              disabled={status === "running"}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-lg transition disabled:opacity-50 shadow-lg"
            >
              <Send className="w-4 h-4" />
              Submit
            </motion.button>
          </div>
        </div>

        {/* Code Editor (Textarea fallback - no Monaco import needed) */}
        <div className="flex-1 overflow-hidden">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-full bg-slate-950 text-green-300 font-mono text-sm p-4 resize-none outline-none border-none"
            style={{ tabSize: 2 }}
            onKeyDown={e => {
              if (e.key === "Tab") {
                e.preventDefault();
                const start = e.target.selectionStart;
                const end = e.target.selectionEnd;
                const newCode = code.substring(0, start) + "  " + code.substring(end);
                setCode(newCode);
                setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 2; }, 0);
              }
            }}
          />
        </div>

        {/* Output Console */}
        <div className="h-40 bg-slate-900 border-t border-white/10 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Console Output</span>
            {status && statusConfig[status] && (
              <span className={`flex items-center gap-1.5 text-sm font-semibold ${statusConfig[status].color}`}>
                {statusConfig[status].icon}
                {statusConfig[status].label}
              </span>
            )}
          </div>
          <pre className="flex-1 overflow-y-auto p-4 text-sm font-mono text-gray-300 whitespace-pre-wrap">
            {output || "Click 'Run' to test your code or 'Submit' to evaluate against all test cases."}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodingPlayground;
