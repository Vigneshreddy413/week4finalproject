// Auth.jsx - Authentication page (Login & Sign Up)
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [mode, setMode] = useState("login"); // 'login' or 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student"); // 'student' or 'instructor'
  const [error, setError] = useState("");
  const login = useStore((state) => state.login);
  const signup = useStore((state) => state.signup);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        const data = await login({ email, password });
        if (data && data.user) {
          if (data.user.role === 'admin') navigate("/admin");
          else if (data.user.role === 'instructor') navigate("/dashboard/instructor");
          else navigate("/dashboard/student");
        }
      } else {
        const data = await signup({ name, email, password, role });
        if (data && data.user) {
          if (data.user.role === 'instructor') navigate("/dashboard/instructor");
          else navigate("/dashboard/student");
        }
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <motion.section
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="relative w-full max-w-md p-8 glass rounded-xl shadow-2xl backdrop-blur-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          {mode === "login" ? "Welcome Back" : "Create an Account"}
        </h2>
        {error && (
          <div className="bg-red-600/20 text-red-200 rounded p-2 mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-white/10 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                <button
                  type="button"
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${role === 'student' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
                  onClick={() => setRole('student')}
                >
                  Student Account
                </button>
                <button
                  type="button"
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${role === 'instructor' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white'}`}
                  onClick={() => setRole('instructor')}
                >
                  Instructor Account
                </button>
              </div>
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-white/10 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-white/10 text-white rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded hover:shadow-lg transition transform hover:-translate-y-0.5"
          >
            {mode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-300">
          {mode === "login" ? (
            <>Don't have an account? <span className="cursor-pointer text-indigo-300 hover:underline" onClick={() => setMode("signup")}>Sign Up</span></>
          ) : (
            <>Already have an account? <span className="cursor-pointer text-indigo-300 hover:underline" onClick={() => setMode("login")}>Sign In</span></>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default Auth;
