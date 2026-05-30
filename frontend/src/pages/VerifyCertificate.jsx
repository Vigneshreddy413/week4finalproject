import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { ShieldCheck, Award, User, BookOpen, Calendar, Loader2, XCircle } from "lucide-react";
import axios from "axios";

const VerifyCertificate = () => {
  const { hash } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const origin = window.location.port === '5173' ? 'http://localhost:5000' : window.location.origin;
    axios.get(`${origin}/api/certificates/verify/${hash}`)
      .then(res => { setCert(res.data); setLoading(false); })
      .catch(() => { setError("Certificate not found or invalid."); setLoading(false); });
  }, [hash]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-4 text-white">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-400" />
            <p className="text-gray-400">Verifying certificate...</p>
          </div>
        ) : error ? (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-red-500/30 p-10 text-center text-white">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Invalid Certificate</h2>
            <p className="text-gray-400">{error}</p>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-green-500/30 p-10 text-white text-center shadow-2xl">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <ShieldCheck className="w-4 h-4" />
              Verified Certificate
            </div>

            <h1 className="text-2xl font-bold mb-1">Certificate of Completion</h1>
            <p className="text-gray-400 text-sm mb-8">This certificate has been verified as authentic.</p>

            {/* Details */}
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                <User className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Recipient</p>
                  <p className="font-semibold">{cert?.userId?.name || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                <BookOpen className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Course</p>
                  <p className="font-semibold">{cert?.courseId?.title || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                <Calendar className="w-5 h-5 text-pink-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Issued On</p>
                  <p className="font-semibold">{cert?.issueDate ? new Date(cert.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                <Award className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Certificate ID</p>
                  <p className="font-mono text-sm text-gray-300 break-all">{hash}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-xs text-gray-500">
              Issued by <span className="text-indigo-400 font-semibold">SynapseAI Platform</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyCertificate;
