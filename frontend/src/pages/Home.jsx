// Home.jsx - Re-designed high-fidelity SaaS Landing Page for SynapseAI
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Terminal, Sparkles, Brain, Cpu, Code2, ShieldAlert, 
  ArrowRight, Award, Zap, Users, CheckCircle, BookOpen, 
  Play, ChevronRight, MessageSquareCode
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("sandbox"); // sandbox, mentor, courses
  
  // Interactive features showcase state
  const tabs = [
    { 
      id: "sandbox", 
      title: "Coding Sandbox", 
      icon: Terminal,
      color: "from-blue-500 to-indigo-500",
      description: "A state-of-the-art interactive coding workspace with Monaco Editor, standard language templates, and instant terminal feedback.",
      tag: "COMPILER V2.0"
    },
    { 
      id: "mentor", 
      title: "AI Cognitive Mentor", 
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      description: "Your personalized virtual AI coding tutor. Get continuous feedback, inline code explanations, and detailed optimizations on demand.",
      tag: "GEMINI 1.5 PRO"
    },
    { 
      id: "courses", 
      title: "Dynamic LMS Modules", 
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
      description: "Structured paths covering React, Tailwind CSS, System Design, and Algorithms with integrated real-time interactive quizzes.",
      tag: "LMS PORTAL"
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 overflow-hidden font-sans">
      
      {/* ─── Glowing Ambient Backgrounds ────────────────────────────────────────── */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[450px] h-[450px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      {/* ─── Hero Section ──────────────────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-8 text-left z-10">
            {/* Announcement Badge */}
            <motion.div 
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
              <span className="text-xs font-semibold tracking-wider text-indigo-300">SYNAPSEAI PLATFORM V1.0</span>
              <ChevronRight className="h-3 w-3 text-slate-400" />
            </motion.div>

            {/* Immersive Taglines */}
            <div className="space-y-4">
              <motion.h1 
                className="text-5xl sm:text-6xl font-extrabold font-display leading-tight tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                The Ultimate <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
                  AI-Powered LMS
                </span> <br />
                & Coding Playground
              </motion.h1>
              
              <motion.p 
                className="text-lg sm:text-xl text-slate-400 max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                SynapseAI connects a modern React learning portal, interactive compilers, gamified stats, and instant AI-driven mentor assistance into one beautiful experience.
              </motion.p>
            </div>

            {/* Dynamic CTA buttons */}
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                to="/auth"
                className="group inline-flex items-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 duration-200"
              >
                <span>Launch SynapseAI</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-200"
              >
                <span>Explore Features</span>
              </a>
            </motion.div>

            {/* Features mini-row */}
            <motion.div 
              className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-medium">Auto-Compile</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-medium">Cognitive Chat</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-medium">Web3 Certificates</span>
              </div>
            </motion.div>
          </div>

          {/* Right Hero Column: Premium Interactive Mock Sandbox */}
          <motion.div 
            className="lg:col-span-5 relative z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Glow border ring */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl" />
            
            {/* Mock Editor Container */}
            <div className="relative glass bg-[#0a0f1d]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Header Tab Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0d1527] border-b border-white/5">
                <div className="flex space-x-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-xs font-mono text-slate-400 flex items-center space-x-1">
                  <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                  <span>playground.js — SynapseAI</span>
                </div>
                <div className="h-4 w-4" /> {/* spacer */}
              </div>

              {/* Mock Code Block */}
              <div className="p-5 font-mono text-xs sm:text-sm space-y-2.5 overflow-x-auto text-indigo-300">
                <p className="text-slate-500">// Initialize Synapse AI Engine</p>
                <p><span className="text-pink-400">import</span> &#123; <span className="text-indigo-400">SynapseAI</span> &#125; <span className="text-pink-400">from</span> <span className="text-emerald-400">"synapse-cognitive"</span>;</p>
                <p>&nbsp;</p>
                <p><span className="text-pink-400">const</span> <span className="text-yellow-400">studentInfo</span> = &#123;</p>
                <p>&nbsp;&nbsp;name: <span className="text-emerald-400">"Future Developer"</span>,</p>
                <p>&nbsp;&nbsp;skills: [<span className="text-emerald-400">"React"</span>, <span className="text-emerald-400">"Node"</span>, <span className="text-emerald-400">"Zustand"</span>],</p>
                <p>&nbsp;&nbsp;aiMentor: <span className="text-pink-400">true</span></p>
                <p>&#125;;</p>
                <p>&nbsp;</p>
                <p><span className="text-purple-400">async</span> <span className="text-pink-400">function</span> <span className="text-yellow-400">initLearningJourney</span>() &#123;</p>
                <p>&nbsp;&nbsp;<span className="text-pink-400">const</span> response = <span className="text-pink-400">await</span> <span className="text-indigo-400">SynapseAI</span>.<span className="text-yellow-400">optimizePath</span>(<span className="text-yellow-400">studentInfo</span>);</p>
                <p>&nbsp;&nbsp;console.<span className="text-yellow-400">log</span>(response.<span className="text-emerald-400">"Welcome to the Future! 🚀"</span>);</p>
                <p>&#125;</p>
              </div>

              {/* Mock Terminal Output Footer */}
              <div className="mt-4 bg-[#070b14] border-t border-white/5 p-4 font-mono text-xs text-slate-400">
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className="text-emerald-400">✔</span>
                  <span className="font-bold text-slate-300">Compilation Successful</span>
                </div>
                <div className="text-indigo-300/80">Output: "Welcome to the Future! 🚀 [Path Optimized with Gemini]"</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Interactive Features Tab Section ─────────────────────────────────── */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-bold tracking-widest text-indigo-400 uppercase">COGNITIVE MODULES</h2>
          <p className="text-4xl font-extrabold tracking-tight">Supercharged Interactive Capabilities</p>
          <p className="text-slate-400 text-base sm:text-lg">
            SynapseAI integrates three pillars of the optimal engineering curriculum, completely automated by generative feedback layers.
          </p>
        </div>

        {/* Tab Selectors */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full md:w-auto flex items-center space-x-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${
                  isActive 
                    ? "bg-white/5 border-indigo-500 shadow-lg shadow-indigo-500/10 text-white" 
                    : "bg-transparent border-white/5 text-slate-400 hover:bg-white/5 hover:border-white/10"
                }`}
              >
                <div className={`p-2 rounded-xl bg-gradient-to-tr ${tab.color} text-white shadow`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-bold tracking-wider">{tab.tag}</p>
                  <p className="text-sm font-bold">{tab.title}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Panel Content Box */}
        <div className="glass bg-[#080d19]/80 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {tabs.map((tab) => {
              if (tab.id !== activeTab) return null;
              return (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="grid md:grid-cols-2 gap-8 items-center"
                >
                  <div className="space-y-6">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold tracking-wide rounded-full text-white bg-gradient-to-r ${tab.color}`}>
                      {tab.tag}
                    </span>
                    <h3 className="text-3xl font-extrabold">{tab.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-base">
                      {tab.description}
                    </p>
                    
                    <ul className="space-y-3.5 text-slate-300 font-medium">
                      <li className="flex items-center space-x-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        <span>Interactive responsive feedback controls</span>
                      </li>
                      <li className="flex items-center space-x-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        <span>Gamified milestones and rewards triggers</span>
                      </li>
                      <li className="flex items-center space-x-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        <span>Seamless light/dark synchronized profiles</span>
                      </li>
                    </ul>

                    <div className="pt-2">
                      <Link
                        to="/auth"
                        className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 font-bold transition"
                      >
                        <span>Experience it in action</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Feature Interactive Visualization Panel */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/5 shadow-inner bg-[#040811] p-6 h-64 flex flex-col justify-center items-center text-center space-y-4">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />
                    
                    {tab.id === "sandbox" && (
                      <>
                        <div className="h-14 w-14 rounded-full bg-blue-500/10 border border-blue-500/35 flex items-center justify-center text-blue-400">
                          <Code2 className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold">Multi-Language Sandbox Compiler</h4>
                          <p className="text-xs text-slate-500 max-w-xs">Supports JS, Python, Java, and C++ with automated code validation and inline syntax checkers.</p>
                        </div>
                      </>
                    )}

                    {tab.id === "mentor" && (
                      <>
                        <div className="h-14 w-14 rounded-full bg-purple-500/10 border border-purple-500/35 flex items-center justify-center text-purple-400">
                          <Brain className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold">Realtime AI Doubt Chatbot</h4>
                          <p className="text-xs text-slate-500 max-w-xs">Click inside your compiler workspace to prompt the AI Cognitive Chatbot for debugging and optimization tips.</p>
                        </div>
                      </>
                    )}

                    {tab.id === "courses" && (
                      <>
                        <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/35 flex items-center justify-center text-emerald-400">
                          <Award className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold">LMS Syllabus & Quizzes</h4>
                          <p className="text-xs text-slate-500 max-w-xs">Watch lecture modules, read compiled PDF study guides, complete dynamic checkups, and win verified graduation certificates.</p>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── Platform Analytics Counters ───────────────────────────────────────── */}
      <section className="relative py-16 bg-[#050917]/70 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <h3 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">10K+</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wider uppercase">ACTIVE STUDENTS</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">250K+</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wider uppercase">CHALLENGES SOLVED</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">1.5M+</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wider uppercase">AI DOUBTS SOLVED</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">4.9★</h3>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wider uppercase">PLATFORM RATING</p>
          </div>
        </div>
      </section>

      {/* ─── Call to Action Footer Panel ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center z-10 relative">
        <div className="absolute inset-0 top-10 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none mx-auto" />
        <div className="relative glass bg-gradient-to-tr from-[#0a0f21] to-[#0c0d16] border border-white/10 rounded-3xl p-12 shadow-2xl space-y-8 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Accelerate Your <br />
            <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">Software Engineering Career?</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Create your account today. Log in as a Student to master programming paradigms, or as an Instructor to draft syllabi and mentor tomorrow's engineers.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link
              to="/auth"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/20 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Sign Up For Free
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-white/5 text-center text-xs text-slate-500">
        <p>© 2026 SynapseAI Platform Inc. Constructed with maximum visual excellence for premium global portfolios.</p>
      </footer>

    </div>
  );
}
