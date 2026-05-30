import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { CheckCircle, PlayCircle, FileText, ChevronRight } from "lucide-react";
import axios from "axios";

const CoursePlayer = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const origin = window.location.port === '5173' ? 'http://localhost:5000' : window.location.origin;
    axios.get(`${origin}/api/courses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const c = res.data.course || res.data;
      setCourse(c);
      if (c.modules?.[0]?.lessons?.[0]) {
        setActiveLesson(c.modules[0].lessons[0]);
      }
      setLoading(false);
    }).catch(() => {
      setCourse({
        title: "Sample Course",
        modules: [
          {
            title: "Getting Started",
            lessons: [
              { _id: "1", title: "Introduction", type: "video", contentUrl: "", duration: 10 },
              { _id: "2", title: "Setup & Installation", type: "text", description: "Follow these steps to set up your environment.", duration: 5 },
            ]
          }
        ]
      });
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 border-r border-white/10 overflow-y-auto flex-shrink-0">
        <div className="p-5 border-b border-white/10">
          <h2 className="font-bold text-lg text-white">{course?.title}</h2>
        </div>
        {course?.modules?.map((mod, mi) => (
          <div key={mi} className="p-4">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">{mod.title}</p>
            {mod.lessons?.map((lesson, li) => (
              <motion.button
                key={lesson._id || li}
                whileHover={{ x: 4 }}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg mb-1 text-left transition ${activeLesson?._id === lesson._id ? "bg-indigo-600/30 text-indigo-300" : "hover:bg-white/5 text-gray-300"}`}
              >
                {lesson.type === "video" ? <PlayCircle className="w-4 h-4 flex-shrink-0" /> : <FileText className="w-4 h-4 flex-shrink-0" />}
                <span className="text-sm flex-1">{lesson.title}</span>
                <span className="text-xs text-gray-500">{lesson.duration}m</span>
              </motion.button>
            ))}
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-900">
          <h3 className="font-semibold text-lg">{activeLesson?.title || "Select a lesson"}</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition text-sm">
            <CheckCircle className="w-4 h-4" />
            Mark Complete
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {activeLesson?.type === "video" ? (
            <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6">
              {activeLesson.contentUrl ? (
                <video controls src={activeLesson.contentUrl} className="w-full h-full" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <PlayCircle className="w-16 h-16 opacity-30" />
                </div>
              )}
            </div>
          ) : activeLesson?.type === "pdf" ? (
            <div className="bg-white/5 rounded-2xl p-8">
              <a href={activeLesson.contentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-semibold transition">
                <FileText className="w-5 h-5" />
                Open PDF Document
              </a>
              <p className="mt-4 text-gray-400 text-sm">{activeLesson.description}</p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none bg-white/5 rounded-2xl p-8 leading-relaxed">
              <p>{activeLesson?.description || "No content available."}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CoursePlayer;
