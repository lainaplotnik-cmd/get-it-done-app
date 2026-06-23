const {
  useState,
  useEffect,
  useRef
} = React;
const SK = "laina_focus_v2";
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
function fmtHour(iso) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}
function daysSince(ts) {
  if (!ts) return 999;
  return Math.floor((Date.now() - ts) / 86400000);
}
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
const PARALYSIS_STEPS = ["Open the thing. Don't do anything else yet.", "Set a 2-minute timer and start.", "Write the task name at the top of a blank page.", "Touch the object/file/doc you need.", "Say out loud: 'Just 2 minutes.'", "Do the smallest, dumbest version of this task.", "Clear one thing off your screen or desk."];

// ── SOMEDAY REVIEW MODAL ──────────────────────────────────────
function SomedayReview({
  tasks,
  onPromote,
  onKeep,
  onDelete,
  onClose,
  onSaveSchedule,
  reviewDay,
  reviewHour
}) {
  const someday = tasks.filter(t => t.tier === "someday" && t.status === "open").sort((a, b) => a.createdAt - b.createdAt).slice(0, 3);
  const [localDay, setLocalDay] = useState(reviewDay ?? 0);
  const [localHour, setLocalHour] = useState(reviewHour ?? 19);
  const [showSchedule, setShowSchedule] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 290,
      background: "rgba(80,50,120,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#FAF5FF",
      border: "1px solid rgba(192,132,252,0.25)",
      borderRadius: 16,
      padding: 24,
      maxWidth: 400,
      width: "100%",
      maxHeight: "85vh",
      overflowY: "auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      marginBottom: 8,
      textAlign: "center"
    }
  }, "🌱"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Bebas Neue',sans-serif",
      fontSize: 26,
      color: "#2D1B4E",
      textAlign: "center",
      marginBottom: 4
    }
  }, "SOMEDAY REVIEW"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(100,60,140,0.45)",
      textAlign: "center",
      marginBottom: 20,
      lineHeight: 1.6
    }
  }, someday.length === 0 ? "Your Someday list is empty — nothing parked." : `${someday.length} thing${someday.length > 1 ? "s" : ""} have been waiting. What do you want to do with them?`), someday.map(t => {
    const days = daysSince(t.createdAt);
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      style: {
        background: "rgba(255,255,255,0.7)",
        border: "1px solid rgba(192,132,252,0.12)",
        borderRadius: 10,
        padding: 14,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "#2D1B4E",
        marginBottom: 6,
        lineHeight: 1.5
      }
    }, t.text), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "rgba(100,60,140,0.4)",
        marginBottom: 10
      }
    }, "Parked ", days, " day", days !== 1 ? "s" : "", " ago", days > 14 && " · has been waiting a while"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onPromote(t.id),
      style: {
        flex: 1,
        background: "#34D399",
        color: "#fff",
        border: "none",
        borderRadius: 7,
        padding: "8px 0",
        fontSize: 11,
        fontWeight: 700,
        cursor: "pointer"
      }
    }, "→ DO IT"), /*#__PURE__*/React.createElement("button", {
      onClick: () => onKeep(t.id),
      style: {
        flex: 1,
        background: "rgba(120,80,160,0.06)",
        color: "rgba(100,60,140,0.5)",
        border: "1px solid rgba(120,80,160,0.1)",
        borderRadius: 7,
        padding: "8px 0",
        fontSize: 11,
        cursor: "pointer"
      }
    }, "KEEP PARKING"), /*#__PURE__*/React.createElement("button", {
      onClick: () => onDelete(t.id),
      style: {
        background: "rgba(248,113,113,0.1)",
        color: "#DC2626",
        border: "1px solid rgba(248,113,113,0.2)",
        borderRadius: 7,
        padding: "8px 10px",
        fontSize: 11,
        cursor: "pointer"
      }
    }, "✕")));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      borderTop: "1px solid rgba(120,80,160,0.08)",
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowSchedule(!showSchedule),
    style: {
      background: "none",
      border: "none",
      color: "#C084FC",
      fontSize: 12,
      cursor: "pointer",
      textDecoration: "underline",
      marginBottom: showSchedule ? 10 : 0
    }
  }, showSchedule ? "Hide schedule settings" : "⏰ Set a regular review time"), showSchedule && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(192,132,252,0.05)",
      borderRadius: 8,
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "rgba(100,60,140,0.4)",
      letterSpacing: 2,
      marginBottom: 8
    }
  }, "REMIND ME EVERY 7 DAYS ON"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      marginBottom: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: localDay,
    onChange: e => setLocalDay(Number(e.target.value)),
    style: {
      flex: 1,
      background: "#FDF8FF",
      border: "1px solid rgba(120,80,160,0.15)",
      borderRadius: 7,
      padding: "8px 10px",
      color: "#2D1B4E",
      fontSize: 12,
      fontFamily: "'DM Mono',monospace"
    }
  }, DAYS.map((d, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    value: i
  }, d))), /*#__PURE__*/React.createElement("select", {
    value: localHour,
    onChange: e => setLocalHour(Number(e.target.value)),
    style: {
      flex: 1,
      background: "#FDF8FF",
      border: "1px solid rgba(120,80,160,0.15)",
      borderRadius: 7,
      padding: "8px 10px",
      color: "#2D1B4E",
      fontSize: 12,
      fontFamily: "'DM Mono',monospace"
    }
  }, Array.from({
    length: 16
  }, (_, i) => i + 7).map(h => /*#__PURE__*/React.createElement("option", {
    key: h,
    value: h
  }, h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onSaveSchedule(localDay, localHour);
      setShowSchedule(false);
    },
    style: {
      width: "100%",
      background: "#C084FC",
      border: "none",
      borderRadius: 7,
      padding: "9px 0",
      color: "#fff",
      fontSize: 12,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Save Schedule"))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: "100%",
      marginTop: 12,
      background: "none",
      border: "none",
      color: "rgba(100,60,140,0.4)",
      fontSize: 12,
      cursor: "pointer",
      padding: "8px 0"
    }
  }, "Done for now")));
}

// Today's real data (pulled fresh for this build)
const TODAY_WEATHER = {
  summary: "Sunny, upper 70s",
  high: 79,
  low: 62,
  rain: false,
  wind: "SW ~10 mph",
  outfit: "Light layers — a tee or light top is fine. No umbrella needed.",
  icon: "☀️"
};
const TODAY_EVENTS = [{
  id: "e1",
  title: "Laina & Andy Meet and Greet",
  start: "2026-06-22T10:00",
  end: "2026-06-22T11:00",
  type: "meeting"
}, {
  id: "e2",
  title: "Daniela x Laina",
  start: "2026-06-22T11:00",
  end: "2026-06-22T11:30",
  type: "meeting"
}, {
  id: "e3",
  title: "Laina Plotnik - Field Marketing Candidate",
  start: "2026-06-22T16:00",
  end: "2026-06-22T16:30",
  type: "interview"
}];
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Bebas+Neue&display=swap');
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes celebrate{0%{opacity:0;transform:scale(0.85)}60%{transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  textarea,input{font-family:'DM Mono',monospace;} textarea:focus,input:focus{outline:none;}
  textarea{resize:none;} *{box-sizing:border-box;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#D8B4FE;border-radius:2px;}
`;

// ── DAY SNAPSHOT CARD ─────────────────────────────────────────
function DayCard() {
  const now = new Date();
  const upcomingEvents = TODAY_EVENTS.filter(e => new Date(e.end) > now);
  const nextEvent = upcomingEvents[0];
  const allDone = upcomingEvents.length === 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20,
      animation: "fadeUp 0.4s ease forwards"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg, rgba(192,132,252,0.1), rgba(167,139,250,0.08))",
      border: "1px solid rgba(192,132,252,0.18)",
      borderRadius: "14px 14px 0 0",
      padding: "14px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 28
    }
  }, TODAY_WEATHER.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Bebas Neue',sans-serif",
      fontSize: 18,
      color: "#2D1B4E"
    }
  }, TODAY_WEATHER.summary, " · ", TODAY_WEATHER.high, "° / ", TODAY_WEATHER.low, "°"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "rgba(100,60,140,0.55)",
      marginTop: 1
    }
  }, "Long Beach, NY · ", TODAY_WEATHER.wind)), !TODAY_WEATHER.rain && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      opacity: 0.4
    },
    title: "No umbrella needed"
  }, "🌂̷")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,0.5)",
      borderRadius: 8,
      padding: "8px 12px",
      fontSize: 12,
      color: "#4C2D8A",
      lineHeight: 1.5
    }
  }, "👗 ", TODAY_WEATHER.outfit)), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,0.7)",
      border: "1px solid rgba(192,132,252,0.12)",
      borderTop: "none",
      borderRadius: "0 0 14px 14px",
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: "rgba(100,60,140,0.4)",
      letterSpacing: 2,
      marginBottom: 10
    }
  }, "TODAY'S CALENDAR"), allDone ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(100,60,140,0.35)"
    }
  }, "All meetings done for today ✓") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, TODAY_EVENTS.map(e => {
    const past = new Date(e.end) < now;
    const active = new Date(e.start) <= now && new Date(e.end) > now;
    const color = e.type === "interview" ? "#F472B6" : "#A78BFA";
    return /*#__PURE__*/React.createElement("div", {
      key: e.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: past ? 0.38 : 1,
        transition: "opacity 0.3s"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 3,
        height: 32,
        borderRadius: 2,
        background: active ? "#34D399" : color,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "#2D1B4E",
        fontWeight: active ? 500 : 400,
        textDecoration: past ? "line-through" : "none"
      }
    }, e.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: "rgba(100,60,140,0.45)"
      }
    }, fmtHour(e.start), " – ", fmtHour(e.end), active ? " · NOW" : "")), active && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        background: "#34D399",
        color: "#fff",
        padding: "2px 7px",
        borderRadius: 20,
        fontWeight: 700,
        letterSpacing: 1
      }
    }, "NOW"));
  })), nextEvent && !allDone && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontSize: 11,
      color: "rgba(100,60,140,0.4)",
      borderTop: "1px solid rgba(120,80,160,0.06)",
      paddingTop: 8
    }
  }, "Next up: ", nextEvent.title, " at ", fmtHour(nextEvent.start))));
}

// ── JOURNAL SCAN MODAL ────────────────────────────────────────
function ScanModal({
  categories,
  onAdd,
  onClose
}) {
  const [step, setStep] = useState("pick"); // pick | scanning | review
  const [imageData, setImageData] = useState(null);
  const [scanned, setScanned] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);
  async function scanImage(base64) {
    setLoading(true);
    setError(null);
    setStep("scanning");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [{
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: base64
              }
            }, {
              type: "text",
              text: `Look at this handwritten to-do list or journal page. Extract every task or action item you can see. Return ONLY a JSON array of strings, one per task, like: ["Task 1","Task 2","Task 3"]. No other text, no markdown, just the raw JSON array. If you can't find any tasks, return [].`
            }]
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.find(b => b.type === "text")?.text || "[]";
      const clean = text.replace(/```json|```/g, "").trim();
      const tasks = JSON.parse(clean);
      setScanned(tasks.map(t => ({
        text: t,
        keep: true,
        tier: "quick",
        cat: categories[0]?.id || "work"
      })));
      setStep("review");
    } catch (e) {
      setError("Couldn't read the image. Try a clearer photo with good lighting.");
      setStep("pick");
    } finally {
      setLoading(false);
    }
  }
  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const base64 = ev.target.result.split(",")[1];
      setImageData(ev.target.result);
      scanImage(base64);
    };
    reader.readAsDataURL(file);
  }
  function addAll() {
    scanned.filter(t => t.keep).forEach(t => {
      onAdd({
        text: t.text,
        notes: "",
        category: t.cat,
        tier: t.tier,
        due: null
      });
    });
    onClose();
  }
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 300,
      background: "rgba(80,50,120,0.55)",
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
      maxHeight: "88vh",
      overflowY: "auto"
    }
  }, step === "pick" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Bebas Neue',sans-serif",
      fontSize: 24,
      color: "#2D1B4E",
      marginBottom: 6
    }
  }, "SCAN YOUR JOURNAL"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(100,60,140,0.5)",
      marginBottom: 24,
      lineHeight: 1.6
    }
  }, "Take a photo of your handwritten to-do list. Claude will read your handwriting and pull out every task."), error && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(248,113,113,0.1)",
      border: "1px solid rgba(248,113,113,0.3)",
      borderRadius: 8,
      padding: "10px 14px",
      fontSize: 12,
      color: "#DC2626",
      marginBottom: 16
    }
  }, error), /*#__PURE__*/React.createElement("input", {
    ref: fileRef,
    type: "file",
    accept: "image/*",
    capture: "environment",
    onChange: handleFile,
    style: {
      display: "none"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => fileRef.current?.click(),
    style: {
      width: "100%",
      background: "#C084FC",
      border: "none",
      borderRadius: 12,
      padding: "16px 0",
      color: "#fff",
      fontSize: 14,
      fontWeight: 700,
      cursor: "pointer",
      marginBottom: 10
    }
  }, "📷 Take a Photo"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (fileRef.current) {
        fileRef.current.removeAttribute("capture");
        fileRef.current.click();
      }
    },
    style: {
      width: "100%",
      background: "rgba(192,132,252,0.1)",
      border: "1px solid rgba(192,132,252,0.2)",
      borderRadius: 12,
      padding: "14px 0",
      color: "#7C3AED",
      fontSize: 13,
      cursor: "pointer",
      marginBottom: 12
    }
  }, "🖼️ Choose from Gallery"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: "100%",
      background: "none",
      border: "none",
      color: "rgba(100,60,140,0.4)",
      fontSize: 12,
      cursor: "pointer",
      padding: "8px 0"
    }
  }, "Cancel")), step === "scanning" && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "40px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      marginBottom: 16,
      animation: "spin 1.5s linear infinite",
      display: "inline-block"
    }
  }, "🔍"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Bebas Neue',sans-serif",
      fontSize: 24,
      color: "#2D1B4E",
      marginBottom: 8
    }
  }, "READING YOUR HANDWRITING..."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(100,60,140,0.45)"
    }
  }, "Give it a moment")), step === "review" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Bebas Neue',sans-serif",
      fontSize: 24,
      color: "#2D1B4E",
      marginBottom: 4
    }
  }, "FOUND ", scanned.length, " TASKS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "rgba(100,60,140,0.5)",
      marginBottom: 20
    }
  }, "Uncheck anything you don't want to add. Edit the text directly."), scanned.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      border: "1px solid rgba(192,132,252,0.15)",
      borderRadius: 10,
      padding: 12,
      marginBottom: 10,
      background: t.keep ? "rgba(192,132,252,0.04)" : "rgba(0,0,0,0.02)",
      opacity: t.keep ? 1 : 0.45
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setScanned(s => s.map((x, j) => j === i ? {
      ...x,
      keep: !x.keep
    } : x)),
    style: {
      width: 22,
      height: 22,
      borderRadius: 5,
      border: t.keep ? "none" : "1.5px solid rgba(100,60,140,0.2)",
      background: t.keep ? "#C084FC" : "transparent",
      color: "#fff",
      fontSize: 11,
      cursor: "pointer",
      flexShrink: 0,
      marginTop: 2
    }
  }, t.keep ? "✓" : ""), /*#__PURE__*/React.createElement("textarea", {
    value: t.text,
    onChange: e => setScanned(s => s.map((x, j) => j === i ? {
      ...x,
      text: e.target.value
    } : x)),
    rows: 2,
    style: {
      flex: 1,
      background: "transparent",
      border: "none",
      color: "#2D1B4E",
      fontSize: 13,
      lineHeight: 1.5,
      padding: 0
    }
  })), t.keep && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      paddingLeft: 32
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setScanned(s => s.map((x, j) => j === i ? {
      ...x,
      tier: "quick"
    } : x)),
    style: {
      padding: "3px 10px",
      borderRadius: 20,
      border: "none",
      cursor: "pointer",
      fontSize: 10,
      background: t.tier === "quick" ? "#34D399" : "rgba(120,80,160,0.06)",
      color: t.tier === "quick" ? "#fff" : "rgba(100,60,140,0.5)"
    }
  }, "⚡ Quick"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setScanned(s => s.map((x, j) => j === i ? {
      ...x,
      tier: "deep"
    } : x)),
    style: {
      padding: "3px 10px",
      borderRadius: 20,
      border: "none",
      cursor: "pointer",
      fontSize: 10,
      background: t.tier === "deep" ? "#A78BFA" : "rgba(120,80,160,0.06)",
      color: t.tier === "deep" ? "#fff" : "rgba(100,60,140,0.5)"
    }
  }, "🧠 Deep"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setScanned(s => s.map((x, j) => j === i ? {
      ...x,
      tier: "someday"
    } : x)),
    style: {
      padding: "3px 10px",
      borderRadius: 20,
      border: "none",
      cursor: "pointer",
      fontSize: 10,
      background: t.tier === "someday" ? "#FBBF24" : "rgba(120,80,160,0.06)",
      color: t.tier === "someday" ? "#fff" : "rgba(100,60,140,0.5)"
    }
  }, "🌱 Someday")))), /*#__PURE__*/React.createElement("button", {
    onClick: addAll,
    style: {
      width: "100%",
      background: "#C084FC",
      border: "none",
      borderRadius: 12,
      padding: "15px 0",
      color: "#fff",
      fontSize: 14,
      fontWeight: 700,
      cursor: "pointer",
      marginTop: 8
    }
  }, "ADD ", scanned.filter(t => t.keep).length, " TASKS"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: "100%",
      background: "none",
      border: "none",
      color: "rgba(100,60,140,0.4)",
      fontSize: 12,
      cursor: "pointer",
      padding: "10px 0"
    }
  }, "Cancel"))));
}

// ── FOCUS CARD ────────────────────────────────────────────────
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
  if (!task) return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "40vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 44,
      marginBottom: 14
    }
  }, "✨"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Bebas Neue',sans-serif",
      fontSize: 28,
      color: "#2D1B4E",
      marginBottom: 8
    }
  }, "ALL CLEAR"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(100,60,140,0.45)"
    }
  }, "No tasks waiting. Tap + to add one."));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      animation: "fadeUp 0.3s ease forwards"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 16
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
      padding: "4px 10px",
      borderRadius: 20,
      background: category.color + "18",
      color: category.color
    }
  }, category.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Bebas Neue',sans-serif",
      fontSize: "clamp(26px,7vw,46px)",
      lineHeight: 1.08,
      color: "#2D1B4E",
      marginBottom: 22,
      wordBreak: "break-word"
    }
  }, task.text), task.notes && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(100,60,140,0.5)",
      marginBottom: 18,
      lineHeight: 1.6,
      fontStyle: "italic"
    }
  }, task.notes), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(192,132,252,0.06)",
      border: "1px solid rgba(192,132,252,0.15)",
      borderRadius: 12,
      padding: 14,
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9,
      color: "rgba(100,60,140,0.4)",
      letterSpacing: 2,
      marginBottom: 3
    }
  }, "TIME ON THIS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "monospace",
      fontSize: 22,
      color: "#2D1B4E"
    }
  }, fmtDuration(elapsed))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTimerRunning(!timerRunning),
    style: {
      background: timerRunning ? "rgba(192,132,252,0.15)" : "#C084FC",
      color: timerRunning ? "#7C3AED" : "#fff",
      border: timerRunning ? "1px solid rgba(192,132,252,0.3)" : "none",
      borderRadius: 8,
      padding: "10px 18px",
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: 1,
      cursor: "pointer"
    }
  }, timerRunning ? "PAUSE" : "START")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onComplete(elapsed),
    style: {
      flex: 1,
      background: "#34D399",
      color: "#fff",
      border: "none",
      borderRadius: 12,
      padding: "14px 0",
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
      padding: "14px 14px",
      fontSize: 12,
      cursor: "pointer"
    }
  }, "SKIP")), /*#__PURE__*/React.createElement("button", {
    onClick: onOpenParalysis,
    style: {
      width: "100%",
      background: "none",
      border: "none",
      color: "rgba(192,132,252,0.6)",
      fontSize: 12,
      padding: "6px 0",
      cursor: "pointer",
      textDecoration: "underline"
    }
  }, "🆘 I'm stuck on this"));
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
      marginTop: 24,
      background: "rgba(120,80,160,0.03)",
      border: "1px solid rgba(120,80,160,0.08)",
      borderRadius: 12,
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "rgba(100,60,140,0.4)",
      letterSpacing: 2,
      marginBottom: 10
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
      marginBottom: 10
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 12,
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

// ── MAIN APP ──────────────────────────────────────────────────
function App() {
  const [tab, setTab] = useState("focus");
  const [tasks, setTasks] = useState(() => load().tasks || []);
  const [categories, setCategories] = useState(() => load().categories || DEFAULT_CATEGORIES);
  const [showAdd, setShowAdd] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [newText, setNewText] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newCat, setNewCat] = useState("work");
  const [newTier, setNewTier] = useState("quick");
  const [newDue, setNewDue] = useState("");
  const [showParalysis, setShowParalysis] = useState(false);
  const [paralysisStep, setParalysisStep] = useState(PARALYSIS_STEPS[0]);
  const [celebration, setCelebration] = useState(null);
  const [showSomedayReview, setShowSomedayReview] = useState(false);
  const [reviewDay, setReviewDay] = useState(() => load().reviewDay ?? null);
  const [reviewHour, setReviewHour] = useState(() => load().reviewHour ?? 19);
  const [lastReviewed, setLastReviewed] = useState(() => load().lastReviewed ?? null);

  // Trigger review if 7+ days since last review AND it's the right time
  useEffect(() => {
    const db = load();
    const daysSinceLast = daysSince(db.lastReviewed);
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    const someday = (db.tasks || []).filter(t => t.tier === "someday" && t.status === "open");
    if (someday.length === 0) return;
    // Auto-show if 7+ days since review (on open)
    if (daysSinceLast >= 7) {
      // If they have a preferred day/hour, check that too
      const prefDay = db.reviewDay;
      const prefHour = db.reviewHour ?? 19;
      if (prefDay == null || currentDay === prefDay && currentHour >= prefHour) {
        setShowSomedayReview(true);
      }
    }
  }, []);
  function markReviewed() {
    const ts = Date.now();
    setLastReviewed(ts);
    save({
      ...load(),
      lastReviewed: ts
    });
  }
  function saveReviewSchedule(day, hour) {
    setReviewDay(day);
    setReviewHour(hour);
    save({
      ...load(),
      reviewDay: day,
      reviewHour: hour
    });
  }
  function persist(t, c) {
    save({
      tasks: t ?? tasks,
      categories: c ?? categories
    });
  }
  function addTask(override) {
    const task = override || {
      text: newText.trim(),
      notes: newNotes.trim(),
      category: newCat,
      tier: newTier,
      due: newDue || null
    };
    if (!task.text) return;
    const full = {
      id: uid(),
      status: "open",
      createdAt: Date.now(),
      completedAt: null,
      timeSpent: 0,
      ...task
    };
    const updated = [...tasks, full];
    setTasks(updated);
    persist(updated, null);
    if (!override) {
      setNewText("");
      setNewNotes("");
      setNewDue("");
      setShowAdd(false);
    }
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
    const updated = [...categories, {
      id: uid(),
      label,
      color
    }];
    setCategories(updated);
    persist(null, updated);
  }
  const openTasks = tasks.filter(t => t.status === "open");
  const quickWins = openTasks.filter(t => t.tier === "quick").sort((a, b) => (a.skippedAt || 0) - (b.skippedAt || 0) || a.createdAt - b.createdAt);
  const deepWork = openTasks.filter(t => t.tier === "deep").sort((a, b) => (a.skippedAt || 0) - (b.skippedAt || 0) || a.createdAt - b.createdAt);
  const someday = openTasks.filter(t => t.tier === "someday").sort((a, b) => a.createdAt - b.createdAt);
  const todayDoneQuick = tasks.filter(t => t.status === "done" && t.tier === "quick" && t.completedAt && new Date(t.completedAt).toISOString().slice(0, 10) === todayKey()).length;
  let currentTask = null,
    currentTier = null;
  if (quickWins.length > 0 && todayDoneQuick < 2) {
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
      fontFamily: "'DM Mono',monospace",
      paddingBottom: 80
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
      padding: "28px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 44,
      marginBottom: 10
    }
  }, "🎉"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Bebas Neue',sans-serif",
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
      fontFamily: "'Bebas Neue',sans-serif",
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
  }, "OK, GOING")))), showSomedayReview && /*#__PURE__*/React.createElement(SomedayReview, {
    tasks: tasks,
    reviewDay: reviewDay,
    reviewHour: reviewHour,
    onPromote: id => {
      const updated = tasks.map(t => t.id === id ? {
        ...t,
        tier: "quick"
      } : t);
      setTasks(updated);
      persist(updated, null);
    },
    onKeep: () => {},
    onDelete: id => {
      const updated = tasks.filter(t => t.id !== id);
      setTasks(updated);
      persist(updated, null);
    },
    onClose: () => {
      setShowSomedayReview(false);
      markReviewed();
    },
    onSaveSchedule: saveReviewSchedule
  }), showScan && /*#__PURE__*/React.createElement(ScanModal, {
    categories: categories,
    onAdd: addTask,
    onClose: () => setShowScan(false)
  }), showAddMenu && /*#__PURE__*/React.createElement("div", {
    onClick: () => setShowAddMenu(false),
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 180
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: "fixed",
      top: 60,
      right: 16,
      background: "#FAF5FF",
      border: "1px solid rgba(192,132,252,0.2)",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 4px 20px rgba(80,50,120,0.15)",
      zIndex: 181
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowAddMenu(false);
      setShowAdd(true);
    },
    style: {
      display: "block",
      width: "100%",
      padding: "14px 20px",
      background: "none",
      border: "none",
      color: "#2D1B4E",
      fontSize: 13,
      cursor: "pointer",
      textAlign: "left",
      borderBottom: "1px solid rgba(120,80,160,0.06)"
    }
  }, "✏️  Type a task"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowAddMenu(false);
      setShowScan(true);
    },
    style: {
      display: "block",
      width: "100%",
      padding: "14px 20px",
      background: "none",
      border: "none",
      color: "#2D1B4E",
      fontSize: 13,
      cursor: "pointer",
      textAlign: "left"
    }
  }, "📷  Scan my journal"))), /*#__PURE__*/React.createElement("div", {
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
      fontFamily: "'Bebas Neue',sans-serif",
      fontSize: 22,
      color: "#2D1B4E"
    }
  }, "GET IT DONE")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowAddMenu(!showAddMenu),
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
    sub: "TASKS"
  }, {
    id: "someday",
    label: "🌱",
    sub: "SOMEDAY"
  }, {
    id: "categories",
    label: "🎨",
    sub: "CATEGORIES"
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTab(t.id),
    style: {
      flex: 1,
      padding: "5px 2px",
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
      fontSize: 13
    }
  }, t.label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 7,
      fontWeight: 600,
      letterSpacing: 0.5,
      color: tab === t.id ? "#fff" : "rgba(100,60,140,0.4)"
    }
  }, t.sub)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 520,
      margin: "0 auto",
      padding: "20px 18px"
    }
  }, tab === "focus" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DayCard, null), /*#__PURE__*/React.createElement(FocusCard, {
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
  }), openTasks.filter(t => t.tier !== "someday").length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      fontSize: 11,
      color: "rgba(100,60,140,0.3)",
      textAlign: "center"
    }
  }, openTasks.filter(t => t.tier !== "someday").length - 1, " more waiting — one thing at a time.")), tab === "all" && /*#__PURE__*/React.createElement("div", {
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
  }, fmtTime(t.completedAt))))), tab === "someday" && /*#__PURE__*/React.createElement("div", {
    style: {
      animation: "fadeUp 0.4s ease forwards"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14,
      padding: "12px 14px",
      background: "rgba(251,191,36,0.07)",
      border: "1px solid rgba(251,191,36,0.2)",
      borderRadius: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#92400E",
      lineHeight: 1.6
    }
  }, "🌱 These don't show up in your Focus view. Park things here that matter but have no deadline.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
      padding: "10px 14px",
      background: "rgba(192,132,252,0.05)",
      border: "1px solid rgba(192,132,252,0.12)",
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#2D1B4E",
      fontWeight: 500
    }
  }, "Weekly review"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "rgba(100,60,140,0.4)",
      marginTop: 2
    }
  }, lastReviewed ? `Last reviewed ${daysSince(lastReviewed)} day${daysSince(lastReviewed) !== 1 ? "s" : ""} ago` : "Never reviewed", reviewDay != null ? ` · ${DAYS[reviewDay]}s at ${reviewHour < 12 ? `${reviewHour} AM` : reviewHour === 12 ? "12 PM" : `${reviewHour - 12} PM`}` : "")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowSomedayReview(true),
    style: {
      background: "#C084FC",
      color: "#fff",
      border: "none",
      borderRadius: 7,
      padding: "7px 14px",
      fontSize: 11,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "REVIEW")), someday.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "rgba(100,60,140,0.25)",
      fontSize: 12,
      textAlign: "center",
      padding: "30px 0"
    }
  }, "Nothing parked here yet."), someday.map(t => {
    const cat = categories.find(c => c.id === t.category);
    const days = daysSince(t.createdAt);
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 6px",
        borderBottom: "1px solid rgba(120,80,160,0.04)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: cat?.color || "#FBBF24",
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "#2D1B4E"
      }
    }, t.text), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: days > 14 ? "#D97706" : "rgba(100,60,140,0.35)",
        marginTop: 2
      }
    }, days, " day", days !== 1 ? "s" : "", " ago", days > 14 ? " · has been waiting a while" : "")), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        const updated = tasks.map(x => x.id === t.id ? {
          ...x,
          tier: "quick"
        } : x);
        setTasks(updated);
        persist(updated, null);
      },
      style: {
        background: "rgba(52,211,153,0.1)",
        border: "1px solid rgba(52,211,153,0.2)",
        color: "#059669",
        borderRadius: 6,
        padding: "4px 10px",
        fontSize: 10,
        cursor: "pointer",
        marginRight: 4
      }
    }, "→ DO IT"), /*#__PURE__*/React.createElement("button", {
      onClick: () => deleteTask(t.id),
      style: {
        background: "none",
        border: "none",
        color: "rgba(100,60,140,0.25)",
        fontSize: 16,
        cursor: "pointer"
      }
    }, "×"));
  })), tab === "categories" && /*#__PURE__*/React.createElement(CategoriesTab, {
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
      fontFamily: "'Bebas Neue',sans-serif",
      fontSize: 24,
      color: "#2D1B4E",
      marginBottom: 16
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
      marginBottom: 10
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
      marginBottom: 14
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
      marginBottom: 14
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
  }, "🧠 Deep work"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setNewTier("someday"),
    style: {
      flex: 1,
      padding: "10px 0",
      borderRadius: 8,
      border: "none",
      cursor: "pointer",
      background: newTier === "someday" ? "#FBBF24" : "rgba(120,80,160,0.06)",
      color: newTier === "someday" ? "#92400E" : "rgba(100,60,140,0.5)",
      fontSize: 12,
      fontWeight: 600
    }
  }, "🌱 Someday")), /*#__PURE__*/React.createElement("div", {
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
      marginBottom: 14
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
      marginBottom: 18
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
      padding: "13px 0",
      color: "rgba(100,60,140,0.5)",
      fontSize: 13,
      cursor: "pointer"
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: () => addTask(),
    style: {
      flex: 2,
      background: "#C084FC",
      border: "none",
      borderRadius: 10,
      padding: "13px 0",
      color: "#fff",
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Add Task")))));
}
function Gate() {
  const [unlocked, setUnlocked] = React.useState(() => {
    try {
      return sessionStorage.getItem("focus_unlocked") === "1";
    } catch {
      return false;
    }
  });
  if (!unlocked) return React.createElement(LockScreen, {
    onUnlock: () => setUnlocked(true)
  });
  return React.createElement(App);
}
