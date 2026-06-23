const {
  useState,
  useEffect,
  useRef
} = React;

// ── STORAGE ───────────────────────────────────────────────────
const SK = "laina_focus_v1";
function load() {
  try {
    const r = localStorage.getItem(SK);
    return r ? JSON.parse(r) : {};
  } catch {
    return {};
  }
}
function save(d) {
  try {
    localStorage.setItem(SK, JSON.stringify(d));
  } catch {}
}

// ── PASSPHRASE LOCK ──────────────────────────────────────────
const PASSPHRASE = "Be-the-change-you-want";
const LOCK_KEY = "focus_unlocked";
function LockScreen({
  onUnlock
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);
  function tryUnlock() {
    if (input === PASSPHRASE) {
      try {
        sessionStorage.setItem(LOCK_KEY, "1");
      } catch {}
      onUnlock();
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 600);
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "#FDF8FF",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      fontFamily: "'DM Mono', monospace"
    }
  }, /*#__PURE__*/React.createElement("style", null, `
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Bebas+Neue&display=swap');
        @keyframes shakeLock { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
        input:focus { outline: none; }
      `), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      marginBottom: 16
    }
  }, "🎯"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 32,
      color: "#2D1B4E",
      marginBottom: 8,
      textAlign: "center"
    }
  }, "GET IT DONE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(100,60,140,0.5)",
      marginBottom: 28,
      textAlign: "center"
    }
  }, "Enter your passphrase to continue"), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    type: "password",
    value: input,
    onChange: e => setInput(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") tryUnlock();
    },
    placeholder: "Passphrase",
    style: {
      width: "100%",
      maxWidth: 320,
      background: "rgba(120,80,160,0.04)",
      border: `1px solid ${error ? "#F87171" : "rgba(120,80,160,0.15)"}`,
      borderRadius: 10,
      padding: "14px 16px",
      color: "#2D1B4E",
      fontSize: 15,
      fontFamily: "'DM Mono', monospace",
      textAlign: "center",
      marginBottom: 16,
      animation: error ? "shakeLock 0.4s ease" : "none"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: tryUnlock,
    style: {
      background: "#C084FC",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      padding: "12px 32px",
      fontFamily: "'DM Mono', monospace",
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: 1,
      cursor: "pointer"
    }
  }, "UNLOCK"), error && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#F87171",
      fontSize: 12,
      marginTop: 12
    }
  }, "Not quite — try again"));
}

// ── HELPERS ───────────────────────────────────────────────────
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function uid() {
  return Date.now() + "_" + Math.random().toString(36).slice(2, 8);
}
function fmtTime(d) {
  return new Date(d).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}
function fmtDuration(s) {
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}

// ── CATEGORIES (user-editable, color coded) ─────────────────
const DEFAULT_CATEGORIES = [{
  id: "work",
  label: "Work",
  color: "#C084FC"
}, {
  id: "job",
  label: "Job Search",
  color: "#A78BFA"
}, {
  id: "alora",
  label: "Alora",
  color: "#F472B6"
}, {
  id: "personal",
  label: "Personal",
  color: "#2DD4BF"
}, {
  id: "home",
  label: "Home",
  color: "#34D399"
}];

// System 1 = quick win, low friction, <15 min, no major setup needed
// System 2 = deep work, needs focus/planning/energy
const PARALYSIS_STEPS = ["Open the thing. Don't do anything else yet.", "Set a 2-minute timer and start.", "Write the task name at the top of a blank page.", "Touch the object/file/doc you need.", "Say out loud: 'Just 2 minutes.'", "Do the smallest, dumbest version of this task.", "Clear one thing off your screen or desk."];
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Bebas+Neue&display=swap');
  *{box-sizing:border-box;} body{margin:0;background:#FDF8FF;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
  @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
  @keyframes celebrate{0%{opacity:0;transform:scale(0.85)}60%{transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
  textarea,input{font-family:'DM Mono',monospace;} textarea:focus,input:focus{outline:none;}
  textarea{resize:none;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#D8B4FE;border-radius:2px;}
`;

// ── TASK CARD (full-screen single task view) ─────────────────
function FocusCard({
  task,
  category,
  onComplete,
  onSkip,
  onOpenParalysis,
  tierLabel,
  tierColor
}) {
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (timerRunning) {
      ref.current = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => clearInterval(ref.current);
  }, [timerRunning]);
  if (!task) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 48,
        marginBottom: 16
      }
    }, "✨"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 32,
        color: "#2D1B4E",
        marginBottom: 8
      }
    }, "ALL CLEAR"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "rgba(100,60,140,0.45)"
      }
    }, "No tasks waiting. Add one when you're ready."));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      animation: "fadeUp 0.4s ease forwards"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      letterSpacing: 2,
      padding: "4px 10px",
      borderRadius: 20,
      background: tierColor + "22",
      color: tierColor,
      fontWeight: 700
    }
  }, tierLabel), category && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      letterSpacing: 1,
      padding: "4px 10px",
      borderRadius: 20,
      background: category.color + "18",
      color: category.color
    }
  }, category.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: "clamp(32px, 8vw, 52px)",
      lineHeight: 1.08,
      color: "#2D1B4E",
      marginBottom: 28,
      wordBreak: "break-word"
    }
  }, task.text), task.notes && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(100,60,140,0.5)",
      marginBottom: 24,
      lineHeight: 1.6,
      fontStyle: "italic"
    }
  }, task.notes), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(192,132,252,0.06)",
      border: "1px solid rgba(192,132,252,0.15)",
      borderRadius: 12,
      padding: 18,
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: "rgba(100,60,140,0.4)",
      letterSpacing: 2,
      marginBottom: 4
    }
  }, "TIME ON THIS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "monospace",
      fontSize: 24,
      color: "#2D1B4E"
    }
  }, fmtDuration(elapsed))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTimerRunning(!timerRunning),
    style: {
      background: timerRunning ? "rgba(192,132,252,0.15)" : "#C084FC",
      color: timerRunning ? "#7C3AED" : "#fff",
      border: timerRunning ? "1px solid rgba(192,132,252,0.3)" : "none",
      borderRadius: 8,
      padding: "10px 20px",
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: 1,
      cursor: "pointer"
    }
  }, timerRunning ? "PAUSE" : "START")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onComplete(elapsed),
    style: {
      flex: 1,
      background: "#34D399",
      color: "#fff",
      border: "none",
      borderRadius: 12,
      padding: "16px 0",
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: 1,
      cursor: "pointer"
    }
  }, "✓ DONE"), /*#__PURE__*/React.createElement("button", {
    onClick: onSkip,
    style: {
      background: "rgba(120,80,160,0.06)",
      color: "rgba(100,60,140,0.5)",
      border: "1px solid rgba(120,80,160,0.12)",
      borderRadius: 12,
      padding: "16px 18px",
      fontSize: 12,
      fontWeight: 600,
      cursor: "pointer"
    }
  }, "SKIP")), /*#__PURE__*/React.createElement("button", {
    onClick: onOpenParalysis,
    style: {
      width: "100%",
      background: "none",
      border: "none",
      color: "rgba(192,132,252,0.7)",
      fontSize: 12,
      padding: "8px 0",
      cursor: "pointer",
      textDecoration: "underline"
    }
  }, "🆘 I'm stuck on this"));
}

// ── MAIN APP ──────────────────────────────────────────────────
function App() {
  const [db, setDb] = useState(load);
  const [tab, setTab] = useState("focus"); // focus | all | calendar | categories
  const [tasks, setTasks] = useState(() => load().tasks || []);
  const [categories, setCategories] = useState(() => load().categories || DEFAULT_CATEGORIES);

  // Add task form
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newCat, setNewCat] = useState(categories[0]?.id || "");
  const [newTier, setNewTier] = useState("quick"); // quick | deep
  const [newDue, setNewDue] = useState("");

  // Paralysis helper
  const [showParalysis, setShowParalysis] = useState(false);
  const [paralysisStep, setParalysisStep] = useState(PARALYSIS_STEPS[0]);
  const [celebration, setCelebration] = useState(null);
  function persist(newTasks, newCats) {
    setDb(prev => {
      const u = {
        ...prev,
        tasks: newTasks ?? tasks,
        categories: newCats ?? categories
      };
      save(u);
      return u;
    });
  }
  function addTask() {
    if (!newText.trim()) return;
    const task = {
      id: uid(),
      text: newText.trim(),
      notes: newNotes.trim(),
      category: newCat,
      tier: newTier,
      due: newDue || null,
      status: "open",
      createdAt: Date.now(),
      completedAt: null,
      timeSpent: 0
    };
    const updated = [...tasks, task];
    setTasks(updated);
    persist(updated, null);
    setNewText("");
    setNewNotes("");
    setNewDue("");
    setShowAdd(false);
  }
  function completeTask(id, timeSpent) {
    const updated = tasks.map(t => t.id === id ? {
      ...t,
      status: "done",
      completedAt: Date.now(),
      timeSpent
    } : t);
    setTasks(updated);
    persist(updated, null);
    setCelebration(tasks.find(t => t.id === id)?.text || "Done!");
    setTimeout(() => setCelebration(null), 2200);
  }
  function skipTask(id) {
    // Move to back of queue by giving it a later sort priority
    const updated = tasks.map(t => t.id === id ? {
      ...t,
      skippedAt: Date.now()
    } : t);
    setTasks(updated);
    persist(updated, null);
  }
  function deleteTask(id) {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    persist(updated, null);
  }
  function addCategory(label, color) {
    const cat = {
      id: uid(),
      label,
      color
    };
    const updated = [...categories, cat];
    setCategories(updated);
    persist(null, updated);
  }

  // ── SYSTEM 1 / SYSTEM 2 SELECTION LOGIC ──
  const openTasks = tasks.filter(t => t.status === "open");
  const quickWins = openTasks.filter(t => t.tier === "quick").sort((a, b) => (a.skippedAt || 0) - (b.skippedAt || 0) || a.createdAt - b.createdAt);
  const deepWork = openTasks.filter(t => t.tier === "deep").sort((a, b) => (a.skippedAt || 0) - (b.skippedAt || 0) || a.createdAt - b.createdAt);

  // Track quick wins completed today to decide when to surface deep work
  const todayCompletedQuick = tasks.filter(t => t.status === "done" && t.tier === "quick" && t.completedAt && new Date(t.completedAt).toISOString().slice(0, 10) === todayKey()).length;
  let currentTask = null,
    currentTier = null;
  if (quickWins.length > 0 && todayCompletedQuick < 2) {
    currentTask = quickWins[0];
    currentTier = "quick";
  } else if (deepWork.length > 0) {
    currentTask = deepWork[0];
    currentTier = "deep";
  } else if (quickWins.length > 0) {
    currentTask = quickWins[0];
    currentTier = "quick";
  }
  const currentCategory = currentTask ? categories.find(c => c.id === currentTask.category) : null;
  const tierLabel = currentTier === "quick" ? "⚡ QUICK WIN" : "🧠 DEEP WORK";
  const tierColor = currentTier === "quick" ? "#34D399" : "#A78BFA";
  const todayDisplay = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
  if (!(() => {
    try {
      return sessionStorage.getItem(LOCK_KEY) === "1";
    } catch {
      return false;
    }
  })()) {
    // handled by Gate wrapper below in render tree — placeholder, not used directly
  }
  const W = {
    maxWidth: 520,
    margin: "0 auto",
    padding: "20px 18px"
  };
  const SL = {
    fontSize: 10,
    color: "rgba(100,60,140,0.35)",
    letterSpacing: 3,
    marginBottom: 14
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "#FDF8FF",
      fontFamily: "'DM Mono', monospace",
      paddingBottom: 100
    }
  }, /*#__PURE__*/React.createElement("style", null, CSS), celebration && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 300,
      background: "rgba(80,50,120,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      animation: "celebrate 0.4s ease forwards",
      background: "#FDF8FF",
      borderRadius: 16,
      padding: "32px 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 48,
      marginBottom: 10
    }
  }, "🎉"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 26,
      color: "#34D399",
      marginBottom: 8
    }
  }, "NICE WORK"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(100,60,140,0.5)",
      maxWidth: 240
    }
  }, celebration))), showParalysis && /*#__PURE__*/React.createElement("div", {
    onClick: () => setShowParalysis(false),
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 250,
      background: "rgba(80,50,120,0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: "#FAF5FF",
      border: "1px solid rgba(192,132,252,0.2)",
      borderRadius: 14,
      padding: 28,
      maxWidth: 360,
      width: "100%",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      marginBottom: 10
    }
  }, "🆘"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#C084FC",
      letterSpacing: 3,
      marginBottom: 12
    }
  }, "YOU'RE STUCK. THAT'S OK."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 24,
      color: "#2D1B4E",
      lineHeight: 1.3,
      marginBottom: 20
    }
  }, paralysisStep), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setParalysisStep(PARALYSIS_STEPS[Math.floor(Math.random() * PARALYSIS_STEPS.length)]),
    style: {
      flex: 1,
      background: "rgba(120,80,160,0.06)",
      color: "rgba(100,60,140,0.6)",
      border: "1px solid rgba(120,80,160,0.12)",
      borderRadius: 8,
      padding: "10px 0",
      fontSize: 12,
      cursor: "pointer"
    }
  }, "ANOTHER ONE"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowParalysis(false),
    style: {
      flex: 1,
      background: "#C084FC",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      padding: "10px 0",
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "OK, GOING")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "rgba(253,248,255,0.97)",
      borderBottom: "1px solid rgba(120,80,160,0.06)",
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 520,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: "#C084FC",
      letterSpacing: 2
    }
  }, todayDisplay.toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 22,
      color: "#2D1B4E"
    }
  }, "GET IT DONE")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowAdd(true),
    style: {
      background: "#C084FC",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      width: 40,
      height: 40,
      fontSize: 22,
      cursor: "pointer",
      fontWeight: 700
    }
  }, "+")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, [{
    id: "focus",
    label: "🎯",
    sub: "FOCUS"
  }, {
    id: "all",
    label: "📋",
    sub: "ALL TASKS"
  }, {
    id: "categories",
    label: "🎨",
    sub: "CATEGORIES"
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    style: {
      flex: 1,
      padding: "6px 2px",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      background: tab === t.id ? "#C084FC" : "rgba(120,80,160,0.05)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, t.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 8,
      fontWeight: 600,
      letterSpacing: 0.5,
      color: tab === t.id ? "#fff" : "rgba(100,60,140,0.4)"
    }
  }, t.sub)))))), /*#__PURE__*/React.createElement("div", {
    style: W
  }, tab === "focus" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FocusCard, {
    task: currentTask,
    category: currentCategory,
    tierLabel: tierLabel,
    tierColor: tierColor,
    onComplete: elapsed => completeTask(currentTask.id, elapsed),
    onSkip: () => skipTask(currentTask.id),
    onOpenParalysis: () => {
      setParalysisStep(PARALYSIS_STEPS[Math.floor(Math.random() * PARALYSIS_STEPS.length)]);
      setShowParalysis(true);
    }
  }), openTasks.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      fontSize: 11,
      color: "rgba(100,60,140,0.3)",
      textAlign: "center"
    }
  }, openTasks.length - 1, " more waiting — one thing at a time.")), tab === "all" && /*#__PURE__*/React.createElement("div", {
    style: {
      animation: "fadeUp 0.4s ease forwards"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: SL
  }, "OPEN — QUICK WINS"), quickWins.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "rgba(100,60,140,0.25)",
      fontSize: 12,
      marginBottom: 20
    }
  }, "None right now."), quickWins.map(t => {
    const cat = categories.find(c => c.id === t.category);
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 4px",
        borderBottom: "1px solid rgba(120,80,160,0.04)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: cat?.color || "#ccc",
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 13,
        color: "#2D1B4E"
      }
    }, t.text), /*#__PURE__*/React.createElement("button", {
      onClick: () => deleteTask(t.id),
      style: {
        background: "none",
        border: "none",
        color: "rgba(100,60,140,0.25)",
        fontSize: 16,
        cursor: "pointer"
      }
    }, "×"));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...SL,
      marginTop: 24
    }
  }, "OPEN — DEEP WORK"), deepWork.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "rgba(100,60,140,0.25)",
      fontSize: 12,
      marginBottom: 20
    }
  }, "None right now."), deepWork.map(t => {
    const cat = categories.find(c => c.id === t.category);
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 4px",
        borderBottom: "1px solid rgba(120,80,160,0.04)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: cat?.color || "#ccc",
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 13,
        color: "#2D1B4E"
      }
    }, t.text), /*#__PURE__*/React.createElement("button", {
      onClick: () => deleteTask(t.id),
      style: {
        background: "none",
        border: "none",
        color: "rgba(100,60,140,0.25)",
        fontSize: 16,
        cursor: "pointer"
      }
    }, "×"));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...SL,
      marginTop: 24
    }
  }, "DONE TODAY"), tasks.filter(t => t.status === "done" && t.completedAt && new Date(t.completedAt).toISOString().slice(0, 10) === todayKey()).map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 4px",
      opacity: 0.45
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12
    }
  }, "✓"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontSize: 12,
      color: "#2D1B4E",
      textDecoration: "line-through"
    }
  }, t.text), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: "rgba(100,60,140,0.3)"
    }
  }, fmtTime(t.completedAt))))), tab === "categories" && /*#__PURE__*/React.createElement(CategoriesTab, {
    categories: categories,
    onAdd: addCategory,
    tasks: tasks
  })), showAdd && /*#__PURE__*/React.createElement("div", {
    onClick: () => setShowAdd(false),
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 200,
      background: "rgba(80,50,120,0.45)",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: "#FDF8FF",
      borderRadius: "20px 20px 0 0",
      padding: 24,
      width: "100%",
      maxWidth: 520,
      maxHeight: "85vh",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 24,
      color: "#2D1B4E",
      marginBottom: 18
    }
  }, "ADD A TASK"), /*#__PURE__*/React.createElement("textarea", {
    value: newText,
    onChange: e => setNewText(e.target.value),
    placeholder: "What needs to happen?",
    rows: 2,
    style: {
      width: "100%",
      background: "rgba(120,80,160,0.04)",
      border: "1px solid rgba(120,80,160,0.1)",
      borderRadius: 10,
      padding: 14,
      color: "#2D1B4E",
      fontSize: 14,
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement("textarea", {
    value: newNotes,
    onChange: e => setNewNotes(e.target.value),
    placeholder: "Notes (optional)",
    rows: 2,
    style: {
      width: "100%",
      background: "rgba(120,80,160,0.04)",
      border: "1px solid rgba(120,80,160,0.1)",
      borderRadius: 10,
      padding: 14,
      color: "#2D1B4E",
      fontSize: 13,
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "rgba(100,60,140,0.4)",
      letterSpacing: 2,
      marginBottom: 8
    }
  }, "EFFORT"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setNewTier("quick"),
    style: {
      flex: 1,
      padding: "10px 0",
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      background: newTier === "quick" ? "#34D399" : "rgba(120,80,160,0.06)",
      color: newTier === "quick" ? "#fff" : "rgba(100,60,140,0.5)",
      fontSize: 12,
      fontWeight: 600
    }
  }, "⚡ Quick win"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setNewTier("deep"),
    style: {
      flex: 1,
      padding: "10px 0",
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      background: newTier === "deep" ? "#A78BFA" : "rgba(120,80,160,0.06)",
      color: newTier === "deep" ? "#fff" : "rgba(100,60,140,0.5)",
      fontSize: 12,
      fontWeight: 600
    }
  }, "🧠 Deep work")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "rgba(100,60,140,0.4)",
      letterSpacing: 2,
      marginBottom: 8
    }
  }, "CATEGORY"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      marginBottom: 16
    }
  }, categories.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    onClick: () => setNewCat(c.id),
    style: {
      padding: "6px 12px",
      borderRadius: 20,
      border: newCat === c.id ? `1.5px solid ${c.color}` : "1px solid rgba(120,80,160,0.1)",
      background: newCat === c.id ? c.color + "18" : "transparent",
      color: newCat === c.id ? c.color : "rgba(100,60,140,0.5)",
      fontSize: 11,
      cursor: "pointer",
      fontWeight: newCat === c.id ? 700 : 400
    }
  }, c.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "rgba(100,60,140,0.4)",
      letterSpacing: 2,
      marginBottom: 8
    }
  }, "DUE DATE (OPTIONAL)"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: newDue,
    onChange: e => setNewDue(e.target.value),
    style: {
      width: "100%",
      background: "rgba(120,80,160,0.04)",
      border: "1px solid rgba(120,80,160,0.1)",
      borderRadius: 10,
      padding: "10px 14px",
      color: "#2D1B4E",
      fontSize: 13,
      marginBottom: 20
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowAdd(false),
    style: {
      flex: 1,
      background: "rgba(120,80,160,0.06)",
      border: "none",
      borderRadius: 10,
      padding: "14px 0",
      color: "rgba(100,60,140,0.5)",
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: addTask,
    style: {
      flex: 2,
      background: "#C084FC",
      border: "none",
      borderRadius: 10,
      padding: "14px 0",
      color: "#fff",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Add Task")))));
}

// ── CATEGORIES TAB ────────────────────────────────────────────
function CategoriesTab({
  categories,
  onAdd,
  tasks
}) {
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("#C084FC");
  const swatches = ["#C084FC", "#A78BFA", "#F472B6", "#2DD4BF", "#34D399", "#FBBF24", "#F87171", "#60A5FA"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      animation: "fadeUp 0.4s ease forwards"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "rgba(100,60,140,0.35)",
      letterSpacing: 3,
      marginBottom: 14
    }
  }, "YOUR CATEGORIES"), categories.map(c => {
    const count = tasks.filter(t => t.category === c.id && t.status === "open").length;
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 4px",
        borderBottom: "1px solid rgba(120,80,160,0.04)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: c.color
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 13,
        color: "#2D1B4E"
      }
    }, c.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "rgba(100,60,140,0.35)"
      }
    }, count, " open"));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      background: "rgba(120,80,160,0.03)",
      border: "1px solid rgba(120,80,160,0.08)",
      borderRadius: 12,
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "rgba(100,60,140,0.4)",
      letterSpacing: 2,
      marginBottom: 12
    }
  }, "ADD A NEW CATEGORY"), /*#__PURE__*/React.createElement("input", {
    value: label,
    onChange: e => setLabel(e.target.value),
    placeholder: "Category name",
    style: {
      width: "100%",
      background: "#FDF8FF",
      border: "1px solid rgba(120,80,160,0.1)",
      borderRadius: 8,
      padding: "10px 14px",
      color: "#2D1B4E",
      fontSize: 13,
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 14,
      flexWrap: "wrap"
    }
  }, swatches.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => setColor(s),
    style: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: s,
      border: color === s ? "3px solid #2D1B4E" : "none",
      cursor: "pointer"
    }
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (label.trim()) {
        onAdd(label.trim(), color);
        setLabel("");
      }
    },
    style: {
      width: "100%",
      background: "#C084FC",
      border: "none",
      borderRadius: 8,
      padding: "10px 0",
      color: "#fff",
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Add Category")));
}
function Gate() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(LOCK_KEY) === "1";
    } catch {
      return false;
    }
  });
  if (!unlocked) return React.createElement(LockScreen, {
    onUnlock: () => setUnlocked(true)
  });
  return React.createElement(App);
}
