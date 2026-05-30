// StudentDashboard.jsx - Premium student dashboard with analytics
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { BarChart, CalendarCheck, TrendingUp, BookOpen } from "lucide-react";

// Simple Card component for reuse
const Card = ({ icon: Icon, title, value }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 flex items-center space-x-4 hover:scale-105 transition-transform">
    <Icon className="w-8 h-8 text-indigo-300" />
    <div>
      <p className="text-sm text-gray-300">{title}</p>
      <p className="text-xl font-semibold text-white">{value}</p>
    </div>
  </div>
);

const StudentDashboard = () => {
  const fetchStudentDashboard = useStore((state) => state.fetchStudentDashboard);
  const dashboard = useStore((state) => state.studentDashboard);
  const loading = useStore((state) => state.loadingDashboard);
  const user = useStore((state) => state.user);

  useEffect(() => {
    fetchStudentDashboard();
  }, [fetchStudentDashboard]);

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-white text-lg">Loading dashboard...</div>
      </motion.div>
    );
  }

  // Support both mock flat structure and real nested structure dynamically
  const stats = dashboard?.stats || dashboard || {};
  const streak = stats.streak ?? stats.learningStreak ?? 7;
  const points = stats.points ?? 1250;
  const rank = stats.rank ?? 42;
  
  // Enrolled courses from user object or dashboard fallback
  const enrolledCourses = user?.enrolledCourses || stats.enrolledCourses || [];
  const completedCourses = user?.completedCourses || [];

  return (
    <motion.main
      className="p-6 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 min-h-screen text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card icon={CalendarCheck} title="Streak (days)" value={streak} />
        <Card icon={TrendingUp} title="Points" value={points} />
        <Card icon={BookOpen} title="Enrolled Courses" value={enrolledCourses.length} />
        <Card icon={BarChart} title="Rank" value={rank} />
      </div>
      {/* Progress overview */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
        <div className="space-y-4">
          {enrolledCourses && enrolledCourses.length > 0 ? (
            enrolledCourses.map((course) => {
              const isCompleted = completedCourses.some(c => c._id === course._id || c === course._id);
              const progressPercent = isCompleted ? 100 : 20; // seed default is 20%
              
              return (
                <div key={course._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-white/5 rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-semibold">{course.title}</span>
                    <span className="text-xs text-gray-400 capitalize">{course.difficulty} • {course.category}</span>
                  </div>
                  <div className="flex items-center space-x-4 w-full sm:w-1/2 justify-end">
                    <span className="text-sm font-semibold">{progressPercent}%</span>
                    <div className="w-1/2 bg-gray-700 rounded h-2">
                      <div
                        className="bg-indigo-400 h-2 rounded"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <Link
                      to={`/course/${course._id}`}
                      className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 rounded text-white font-semibold transition"
                    >
                      Resume
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-300">No enrolled courses yet.</p>
          )}
        </div>
      </div>
    </motion.main>
  );
};

export default StudentDashboard;
