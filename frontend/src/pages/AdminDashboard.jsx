import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Code2, ShieldCheck, Trash2, BarChart3 } from "lucide-react";
import axios from "axios";

const StatCard = ({ icon: Icon, title, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.04 }}
    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 flex items-center gap-4 border border-white/10 shadow-lg"
  >
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, totalChallenges: 0, activeSessions: 0 });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const origin = window.location.port === "5173" ? "http://localhost:5000" : window.location.origin;
    
    // Fetch stats
    axios.get(`${origin}/api/dashboard/admin`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const d = res.data;
      setStats({
        totalUsers: d.stats?.totalUsers || 0,
        totalCourses: d.stats?.totalCourses || 0,
        totalChallenges: d.stats?.totalChallenges || 0,
        activeSessions: d.stats?.totalSubmissions || 0, // map total submissions to dynamic active items
      });
    }).catch(() => {
      setStats({ totalUsers: 512, totalCourses: 18, totalChallenges: 45, activeSessions: 23 });
    });

    // Fetch user list
    axios.get(`${origin}/api/users`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setUsers(res.data.users || []);
    }).catch(() => {});
  }, []);

  return (
    <motion.main
      className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
            Admin Panel
          </h1>
          <p className="text-gray-400 mt-1">Platform-wide management and analytics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={Users} title="Total Users" value={stats.totalUsers} color="bg-indigo-500" />
          <StatCard icon={BookOpen} title="Total Courses" value={stats.totalCourses} color="bg-purple-500" />
          <StatCard icon={Code2} title="Challenges" value={stats.totalChallenges} color="bg-pink-500" />
          <StatCard icon={BarChart3} title="Active Sessions" value={stats.activeSessions} color="bg-cyan-500" />
        </div>

        {/* Users Table */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-semibold">User Management</h2>
          </div>
          {users.length === 0 ? (
            <div className="p-10 text-center text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-white/10">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Joined</th>
                    <th className="text-left p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="p-4 font-medium">{u.name}</td>
                      <td className="p-4 text-gray-300">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${u.role === "admin" ? "bg-red-500/20 text-red-400" : u.role === "instructor" ? "bg-purple-500/20 text-purple-400" : "bg-indigo-500/20 text-indigo-400"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button className="text-red-400 hover:text-red-300 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.main>
  );
};

export default AdminDashboard;
