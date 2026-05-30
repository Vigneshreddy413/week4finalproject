import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Compass,
  Flame,
  Lightbulb,
  ListChecks,
  Play,
  RotateCcw,
  Sparkles,
  Timer,
} from "lucide-react";

const quizBank = {
  react: [
    {
      q: "Which hook is best for loading data after a component renders?",
      options: ["useMemo", "useEffect", "useRef", "useReducer"],
      answer: "useEffect",
      why: "useEffect runs side effects such as fetching data after render.",
    },
    {
      q: "What should React list items usually include?",
      options: ["A className", "A key", "A ref", "A reducer"],
      answer: "A key",
      why: "Keys help React identify which items changed, moved, or were removed.",
    },
    {
      q: "Which state update style is safest when the next value depends on the previous value?",
      options: ["setCount(count + 1)", "setCount(() => 0)", "setCount(prev => prev + 1)", "setCount(null)"],
      answer: "setCount(prev => prev + 1)",
      why: "Functional updates avoid stale state when React batches updates.",
    },
    {
      q: "What does a controlled input use as its source of truth?",
      options: ["DOM only", "React state", "Browser cache", "CSS"],
      answer: "React state",
      why: "Controlled inputs read value from state and update through events.",
    },
    {
      q: "What is React Router mainly used for?",
      options: ["Database access", "Client-side navigation", "CSS compilation", "Image compression"],
      answer: "Client-side navigation",
      why: "React Router maps URLs to components in a single-page app.",
    },
  ],
  node: [
    {
      q: "Which Express method handles incoming JSON bodies?",
      options: ["express.json()", "express.files()", "express.cache()", "express.mount()"],
      answer: "express.json()",
      why: "express.json() parses JSON request bodies into req.body.",
    },
    {
      q: "What status code usually means a resource was created?",
      options: ["200", "201", "301", "500"],
      answer: "201",
      why: "201 Created is the standard response after creating a resource.",
    },
    {
      q: "What does middleware commonly receive?",
      options: ["req, res, next", "html, css, js", "state, props", "schema, table"],
      answer: "req, res, next",
      why: "Express middleware can inspect the request, write a response, or call next.",
    },
    {
      q: "What is JWT commonly used for?",
      options: ["Image editing", "Authentication", "Code formatting", "SQL indexing"],
      answer: "Authentication",
      why: "JWTs carry signed claims that can identify a logged-in user.",
    },
    {
      q: "Which database library is used in this backend?",
      options: ["Prisma", "Mongoose", "Sequelize", "Knex"],
      answer: "Mongoose",
      why: "The backend imports mongoose and connects to MongoDB.",
    },
  ],
  algorithms: [
    {
      q: "Which structure is best for FIFO processing?",
      options: ["Stack", "Queue", "Tree", "Set"],
      answer: "Queue",
      why: "A queue processes the first item inserted before later items.",
    },
    {
      q: "Binary search requires data to be what?",
      options: ["Encrypted", "Sorted", "Duplicated", "Random"],
      answer: "Sorted",
      why: "Binary search repeatedly discards half of a sorted range.",
    },
    {
      q: "What is the time complexity of scanning every item once?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
      answer: "O(n)",
      why: "One pass through n items grows linearly with input size.",
    },
    {
      q: "Which approach breaks a problem into overlapping subproblems?",
      options: ["Dynamic programming", "CSS grid", "Hashing only", "Serialization"],
      answer: "Dynamic programming",
      why: "Dynamic programming stores answers to repeated subproblems.",
    },
    {
      q: "What does a hash map optimize for?",
      options: ["Fast key lookup", "Video rendering", "Network latency", "Type checking"],
      answer: "Fast key lookup",
      why: "Hash maps commonly provide near constant-time lookup by key.",
    },
  ],
};

const roadmapData = {
  frontend: ["React state patterns", "Routing and forms", "API integration", "Accessibility basics", "Performance profiling"],
  backend: ["REST API design", "Auth and JWT", "MongoDB modeling", "Validation and errors", "Deployment readiness"],
  fullstack: ["Feature slicing", "Shared API contracts", "Auth flows", "Testing strategy", "Production builds"],
  ai: ["Prompt design", "Vector search basics", "Evaluation sets", "Safety checks", "Human review loops"],
};

const Card = ({ title, icon: Icon, children, className = "" }) => (
  <section className={`rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-black/10 ${className}`}>
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-200">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-lg font-bold text-white">{title}</h2>
    </div>
    {children}
  </section>
);

const FieldLabel = ({ children }) => (
  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">{children}</label>
);

const SmartTools = () => {
  const [goal, setGoal] = useState("Become job-ready in React and Node");
  const [days, setDays] = useState(14);
  const [minutes, setMinutes] = useState(45);
  const [plan, setPlan] = useState(() => JSON.parse(localStorage.getItem("smart_plan") || "[]"));

  const [topic, setTopic] = useState("react");
  const [answers, setAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const [code, setCode] = useState("function total(items) {\n  var sum = 0\n  items.forEach(item => {\n    console.log(item)\n    sum += item.price\n  })\n  return sum\n}");
  const [role, setRole] = useState("fullstack");
  const [skills, setSkills] = useState("React, JavaScript, MongoDB");

  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sprints, setSprints] = useState(() => Number(localStorage.getItem("smart_sprints") || 0));
  const [focusNote, setFocusNote] = useState("Finish one lesson and one coding challenge");

  useEffect(() => {
    localStorage.setItem("smart_plan", JSON.stringify(plan));
  }, [plan]);

  useEffect(() => {
    localStorage.setItem("smart_sprints", String(sprints));
  }, [sprints]);

  useEffect(() => {
    if (!timerRunning) return undefined;
    const timer = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          setTimerRunning(false);
          setSprints((value) => value + 1);
          return 25 * 60;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerRunning]);

  const quiz = quizBank[topic];
  const quizScore = quiz.reduce((score, item, index) => score + (answers[index] === item.answer ? 1 : 0), 0);

  const codeReview = useMemo(() => {
    const lines = code.split("\n");
    const findings = [];
    if (/\bvar\b/.test(code)) findings.push("Replace var with let or const to reduce accidental reassignment.");
    if (/console\.log/.test(code)) findings.push("Remove console.log statements before submitting production code.");
    if (lines.some((line) => line.length > 90)) findings.push("Wrap long lines so code is easier to scan during review.");
    if (!/try|catch/.test(code) && /fetch|axios|await/.test(code)) findings.push("Add error handling around async or network work.");
    if (lines.filter((line) => /^\s*(if|for|while|switch|items\.forEach)/.test(line)).length >= 3) {
      findings.push("Consider extracting smaller helper functions to keep complexity low.");
    }
    if (findings.length === 0) findings.push("Nice. No obvious beginner-level issues detected in this snippet.");

    return {
      lines: lines.length,
      score: Math.max(55, 100 - findings.length * 10),
      findings,
    };
  }, [code]);

  const roadmap = useMemo(() => {
    const owned = skills
      .split(",")
      .map((skill) => skill.trim().toLowerCase())
      .filter(Boolean);
    return roadmapData[role].map((step, index) => ({
      step,
      week: index + 1,
      status: owned.some((skill) => step.toLowerCase().includes(skill)) ? "Review" : "Learn",
    }));
  }, [role, skills]);

  const generatePlan = () => {
    const focusAreas = ["Learn", "Practice", "Build", "Review", "Test"];
    const nextPlan = Array.from({ length: Number(days) }, (_, index) => {
      const mode = focusAreas[index % focusAreas.length];
      return {
        day: index + 1,
        title: `${mode}: ${goal}`,
        task:
          mode === "Build"
            ? "Ship a tiny project slice and write down what broke."
            : mode === "Practice"
              ? "Solve two focused exercises and compare patterns."
              : mode === "Review"
                ? "Summarize notes, flashcards, and one weak topic."
                : mode === "Test"
                  ? "Take a quiz, fix mistakes, and update your checklist."
                  : "Study one core concept and create a small example.",
        minutes,
      };
    });
    setPlan(nextPlan);
  };

  const resetQuiz = (nextTopic) => {
    setTopic(nextTopic);
    setAnswers({});
    setQuizSubmitted(false);
  };

  const formatTime = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  return (
    <motion.main
      className="min-h-screen bg-[#07111f] px-4 py-10 text-slate-100 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Smart learning lab
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Five Working Smart Features</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Plan your week, quiz yourself, review code, map your career path, and run focused study sprints from one local workspace.
            </p>
          </div>
          <div className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
            Saved locally in this browser
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card title="1. Smart Study Planner" icon={CalendarDays}>
            <div className="grid gap-3 sm:grid-cols-[1fr_120px_120px]">
              <div className="space-y-1.5">
                <FieldLabel>Learning goal</FieldLabel>
                <input
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Days</FieldLabel>
                <input
                  type="number"
                  min="3"
                  max="30"
                  value={days}
                  onChange={(event) => setDays(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                />
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Minutes</FieldLabel>
                <input
                  type="number"
                  min="15"
                  max="180"
                  value={minutes}
                  onChange={(event) => setMinutes(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                />
              </div>
            </div>
            <button onClick={generatePlan} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300">
              <Brain className="h-4 w-4" />
              Generate plan
            </button>
            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
              {plan.length === 0 ? (
                <p className="text-sm text-slate-400">Generate a plan to see daily tasks.</p>
              ) : (
                plan.map((item) => (
                  <div key={item.day} className="rounded-lg bg-slate-950/45 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-white">Day {item.day}: {item.title}</p>
                      <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-xs text-cyan-100">{item.minutes}m</span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{item.task}</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card title="2. Adaptive Quiz Builder" icon={ClipboardCheck}>
            <div className="mb-4 flex flex-wrap gap-2">
              {Object.keys(quizBank).map((item) => (
                <button
                  key={item}
                  onClick={() => resetQuiz(item)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize ${
                    topic === item ? "bg-cyan-400 text-slate-950" : "bg-white/10 text-slate-300 hover:bg-white/15"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {quiz.map((item, index) => (
                <div key={item.q} className="rounded-lg bg-slate-950/45 p-3">
                  <p className="mb-3 text-sm font-semibold text-white">{index + 1}. {item.q}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {item.options.map((option) => {
                      const selected = answers[index] === option;
                      const correct = quizSubmitted && item.answer === option;
                      const wrong = quizSubmitted && selected && item.answer !== option;
                      return (
                        <button
                          key={option}
                          onClick={() => setAnswers((current) => ({ ...current, [index]: option }))}
                          className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
                            correct
                              ? "border-emerald-300 bg-emerald-400/15 text-emerald-100"
                              : wrong
                                ? "border-red-300 bg-red-400/15 text-red-100"
                                : selected
                                  ? "border-cyan-300 bg-cyan-400/15 text-cyan-100"
                                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && <p className="mt-2 text-xs text-slate-400">{item.why}</p>}
                </div>
              ))}
            </div>
            <button onClick={() => setQuizSubmitted(true)} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Score quiz: {quizSubmitted ? `${quizScore}/${quiz.length}` : "ready"}
            </button>
          </Card>

          <Card title="3. Smart Code Reviewer" icon={Code2}>
            <textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              rows={10}
              className="w-full rounded-lg border border-white/10 bg-slate-950/70 p-3 font-mono text-xs leading-5 text-slate-100 outline-none focus:border-cyan-300"
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-[120px_1fr]">
              <div className="rounded-lg bg-slate-950/50 p-3 text-center">
                <p className="text-xs text-slate-400">Quality score</p>
                <p className="text-3xl font-black text-cyan-200">{codeReview.score}</p>
                <p className="text-xs text-slate-500">{codeReview.lines} lines</p>
              </div>
              <div className="space-y-2">
                {codeReview.findings.map((finding) => (
                  <div key={finding} className="flex gap-2 rounded-lg bg-white/5 p-2 text-sm text-slate-300">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-yellow-200" />
                    <span>{finding}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="4. Career Roadmap Recommender" icon={Compass}>
            <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
              <div className="space-y-1.5">
                <FieldLabel>Target role</FieldLabel>
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="fullstack">Full stack</option>
                  <option value="ai">AI app builder</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <FieldLabel>Current skills</FieldLabel>
                <input
                  value={skills}
                  onChange={(event) => setSkills(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {roadmap.map((item) => (
                <div key={item.step} className="flex items-center justify-between gap-3 rounded-lg bg-slate-950/45 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-cyan-100">
                      W{item.week}
                    </div>
                    <p className="text-sm font-semibold text-white">{item.step}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-bold ${item.status === "Review" ? "bg-emerald-400/15 text-emerald-100" : "bg-amber-400/15 text-amber-100"}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="5. Focus Sprint Tracker" icon={Timer} className="lg:col-span-2">
            <div className="grid gap-5 md:grid-cols-[260px_1fr]">
              <div className="rounded-lg bg-slate-950/50 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Current sprint</p>
                <p className="mt-3 font-mono text-5xl font-black text-white">{formatTime}</p>
                <div className="mt-4 flex justify-center gap-2">
                  <button onClick={() => setTimerRunning((value) => !value)} className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-300">
                    <Play className="h-4 w-4" />
                    {timerRunning ? "Pause" : "Start"}
                  </button>
                  <button
                    onClick={() => {
                      setTimerRunning(false);
                      setSecondsLeft(25 * 60);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <FieldLabel>Sprint mission</FieldLabel>
                  <input
                    value={focusNote}
                    onChange={(event) => setFocusNote(event.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none focus:border-cyan-300"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-white/5 p-4">
                    <Flame className="mb-2 h-5 w-5 text-orange-200" />
                    <p className="text-2xl font-black text-white">{sprints}</p>
                    <p className="text-xs text-slate-400">Completed sprints</p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-4">
                    <ListChecks className="mb-2 h-5 w-5 text-emerald-200" />
                    <p className="text-2xl font-black text-white">{Math.max(1, Math.ceil(secondsLeft / 300))}</p>
                    <p className="text-xs text-slate-400">Focus blocks left</p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-4">
                    <Sparkles className="mb-2 h-5 w-5 text-cyan-200" />
                    <p className="text-sm font-bold text-white">{focusNote}</p>
                    <p className="mt-1 text-xs text-slate-400">Active mission</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.main>
  );
};

export default SmartTools;
