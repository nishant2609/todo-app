// Member 3 - Gauri- Adding Date features
// Member 3 - Gauri - Adding Date features
import { useState, useEffect, useRef } from "react";

const CATEGORIES = ["All", "Work", "Personal", "Shopping", "Health", "Study"];
const PRIORITIES = ["Low", "Medium", "High"];
const PRIORITY_COLORS = { Low: "#22c55e", Medium: "#f59e0b", High: "#ef4444" };
const CATEGORY_COLORS = {
  Work: "#6366f1", Personal: "#ec4899", Shopping: "#f97316",
  Health: "#10b981", Study: "#3b82f6"
};

const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const formatTime = (d) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

export default function App() {
  const [todos, setTodos] = useState(() => {
    try { return JSON.parse(localStorage.getItem("todos") || "[]"); } catch { return []; }
  });
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("tasks");
  const [filterCat, setFilterCat] = useState("All");
  const [filterPri, setFilterPri] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState({
    text: "", category: "Personal", priority: "Medium",
    dueDate: "", dueTime: "", note: "", photo: null, reminder: false
  });
  const fileRef = useRef();

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (!("Notification" in window)) return;
    todos.forEach(todo => {
      if (todo.reminder && todo.dueDate && !todo.done && !todo.notified) {
        const due = new Date(`${todo.dueDate}T${todo.dueTime || "09:00"}`);
        const now = new Date();
        const diff = due - now;
        if (diff > 0 && diff < 60 * 60 * 1000) {
          setTimeout(() => {
            if (Notification.permission === "granted") {
              new Notification("Task Reminder", { body: todo.text });
            }
            setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, notified: true } : t));
          }, diff);
        }
      }
    });
  }, [todos]);

  const resetForm = () => setForm({ text: "", category: "Personal", priority: "Medium", dueDate: "", dueTime: "", note: "", photo: null, reminder: false });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(f => ({ ...f, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.text.trim()) return;
    if (editId) {
      setTodos(prev => prev.map(t => t.id === editId ? { ...t, ...form, updatedAt: Date.now() } : t));
      setEditId(null);
    } else {
      setTodos(prev => [...prev, { ...form, id: Date.now(), done: false, createdAt: Date.now(), updatedAt: null }]);
    }
    resetForm(); setShowForm(false);
  };

  const toggleDone = (id) => setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done, doneAt: !t.done ? Date.now() : null } : t));
  const deleteTodo = (id) => setTodos(prev => prev.filter(t => t.id !== id));
  const startEdit = (todo) => {
    setForm({ text: todo.text, category: todo.category, priority: todo.priority, dueDate: todo.dueDate || "", dueTime: todo.dueTime || "", note: todo.note || "", photo: todo.photo || null, reminder: todo.reminder || false });
    setEditId(todo.id); setShowForm(true);
  };

  const requestNotif = () => { if ("Notification" in window) Notification.requestPermission(); };

  const activeTodos = todos.filter(t => !t.done);
  const doneTodos = todos.filter(t => t.done);

  const filtered = (activeTab === "tasks" ? activeTodos : doneTodos).filter(t => {
    if (filterCat !== "All" && t.category !== filterCat) return false;
    if (filterPri !== "All" && t.priority !== filterPri) return false;
    if (searchQuery && !t.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const d = darkMode;
  const bg = d ? "#0f0f1a" : "#f0f4ff";
  const card = d ? "#1a1a2e" : "#ffffff";
  const text = d ? "#e2e8f0" : "#1e293b";
  const muted = d ? "#94a3b8" : "#64748b";
  const border = d ? "#2d2d4a" : "#e2e8f0";
  const inputBg = d ? "#252540" : "#f8faff";

  return (
    <div style={{ minHeight: "100vh", background: d ? "linear-gradient(135deg,#0f0f1a 0%,#1a0a2e 50%,#0a1628 100%)" : "linear-gradient(135deg,#667eea22 0%,#764ba222 50%,#f093fb22 100%)", backgroundColor: bg, fontFamily: "'Nunito', 'Segoe UI', sans-serif", color: text, transition: "all 0.3s" }}>

      <div style={{ background: d ? "linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899)" : "linear-gradient(90deg,#6366f1,#8b5cf6,#ec4899)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 24px #6366f144" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>✅ TaskMaster</h1>
          <p style={{ margin: 0, color: "#e0d7ff", fontSize: 13 }}>{activeTodos.length} active · {doneTodos.length} completed</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={requestNotif} title="Enable reminders" style={{ background: "#ffffff22", border: "none", color: "#fff", borderRadius: 10, padding: "8px 12px", cursor: "pointer", fontSize: 18 }}>🔔</button>
          <button onClick={() => setDarkMode(!d)} style={{ background: "#ffffff22", border: "none", color: "#fff", borderRadius: 10, padding: "8px 12px", cursor: "pointer", fontSize: 18 }}>{d ? "☀️" : "🌙"}</button>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total", value: todos.length, color: "#6366f1", icon: "📋" },
            { label: "Active", value: activeTodos.length, color: "#f59e0b", icon: "⚡" },
            { label: "Done", value: doneTodos.length, color: "#22c55e", icon: "✅" },
            { label: "High Pri", value: todos.filter(t => t.priority === "High" && !t.done).length, color: "#ef4444", icon: "🔥" },
          ].map(s => (
            <div key={s.label} style={{ background: card, borderRadius: 16, padding: "14px 12px", textAlign: "center", border: `1px solid ${border}`, boxShadow: `0 2px 12px ${s.color}22` }}>
              <div style={{ fontSize: 22 }}>{s.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: muted, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20, background: card, borderRadius: 14, padding: 6, border: `1px solid ${border}` }}>
          {["tasks", "history"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14, transition: "all 0.2s", background: activeTab === tab ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "transparent", color: activeTab === tab ? "#fff" : muted }}>
              {tab === "tasks" ? "📝 Tasks" : "📜 History"}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", marginBottom: 16 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search tasks..." style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: 12, border: `1px solid ${border}`, background: inputBg, color: text, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilterCat(c)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", whiteSpace: "nowrap", fontWeight: 600, fontSize: 13, transition: "all 0.2s", background: filterCat === c ? (CATEGORY_COLORS[c] || "#6366f1") : (d ? "#252540" : "#e8eeff"), color: filterCat === c ? "#fff" : muted }}>
              {c}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["All", ...PRIORITIES].map(p => (
            <button key={p} onClick={() => setFilterPri(p)} style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${filterPri === p ? (PRIORITY_COLORS[p] || "#6366f1") : border}`, cursor: "pointer", fontWeight: 700, fontSize: 12, background: filterPri === p ? (PRIORITY_COLORS[p] || "#6366f1") + "22" : "transparent", color: filterPri === p ? (PRIORITY_COLORS[p] || "#6366f1") : muted }}>
              {p === "All" ? "All Priority" : `${p === "High" ? "🔥" : p === "Medium" ? "⚡" : "🟢"} ${p}`}
            </button>
          ))}
        </div>

        {!showForm && (
          <button onClick={() => { resetForm(); setEditId(null); setShowForm(true); }} style={{ width: "100%", padding: "14px", borderRadius: 14, border: "2px dashed #8b5cf6", background: d ? "#1a1a3e" : "#f5f0ff", color: "#8b5cf6", fontWeight: 800, fontSize: 16, cursor: "pointer", marginBottom: 20 }}>
            ＋ Add New Task
          </button>
        )}

        {showForm && (
          <div style={{ background: card, borderRadius: 20, padding: 20, marginBottom: 20, border: `1px solid ${border}`, boxShadow: "0 8px 32px #6366f122" }}>
            <h3 style={{ margin: "0 0 16px", color: "#8b5cf6", fontWeight: 800 }}>{editId ? "✏️ Edit Task" : "➕ New Task"}</h3>

            <input value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} placeholder="What needs to be done?" style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${border}`, background: inputBg, color: text, fontSize: 16, fontWeight: 600, outline: "none", marginBottom: 12, boxSizing: "border-box" }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: muted, display: "block", marginBottom: 4 }}>📁 CATEGORY</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: "100%", padding: "10px", borderRadius: 10, border: `1px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none" }}>
                  {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: muted, display: "block", marginBottom: 4 }}>🎯 PRIORITY</label>
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} style={{ width: "100%", padding: "10px", borderRadius: 10, border: `1px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none" }}>
                  {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: muted, display: "block", marginBottom: 4 }}>📅 DUE DATE</label>
                <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} style={{ width: "100%", padding: "10px", borderRadius: 10, border: `1px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: muted, display: "block", marginBottom: 4 }}>⏰ DUE TIME</label>
                <input type="time" value={form.dueTime} onChange={e => setForm(f => ({ ...f, dueTime: e.target.value }))} style={{ width: "100%", padding: "10px", borderRadius: 10, border: `1px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>

            <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="📝 Add a note (optional)..." rows={3} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${border}`, background: inputBg, color: text, fontSize: 14, outline: "none", resize: "vertical", marginBottom: 12, boxSizing: "border-box" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
              <button onClick={() => fileRef.current.click()} style={{ padding: "8px 16px", borderRadius: 10, border: `1px solid ${border}`, background: inputBg, color: text, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
                📷 {form.photo ? "Change Photo" : "Attach Photo"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
              {form.photo && <img src={form.photo} alt="preview" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />}
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, color: form.reminder ? "#8b5cf6" : muted }}>
                <input type="checkbox" checked={form.reminder} onChange={e => setForm(f => ({ ...f, reminder: e.target.checked }))} />
                🔔 Set Reminder
              </label>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleSubmit} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "none", background: "linear-gradient(90deg,#6366f1,#8b5cf6)", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
                {editId ? "💾 Save Changes" : "✅ Add Task"}
              </button>
              <button onClick={() => { setShowForm(false); setEditId(null); resetForm(); }} style={{ padding: "12px 20px", borderRadius: 12, border: `1px solid ${border}`, background: "transparent", color: muted, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 20px", color: muted }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{activeTab === "history" ? "📜" : "🎉"}</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{activeTab === "history" ? "No completed tasks yet" : "No tasks found"}</div>
              <div style={{ fontSize: 14, marginTop: 4 }}>{activeTab === "tasks" ? "Add a new task above!" : "Complete some tasks first"}</div>
            </div>
          )}

          {filtered.map(todo => {
            const isExpanded = expandedId === todo.id;
            const catColor = CATEGORY_COLORS[todo.category] || "#6366f1";
            const priColor = PRIORITY_COLORS[todo.priority] || "#22c55e";
            const isOverdue = todo.dueDate && !todo.done && new Date(`${todo.dueDate}T${todo.dueTime || "23:59"}`) < new Date();

            return (
              <div key={todo.id} style={{ background: card, borderRadius: 18, border: `1px solid ${isOverdue ? "#ef444444" : border}`, boxShadow: todo.done ? "none" : `0 2px 16px ${catColor}18`, overflow: "hidden", transition: "all 0.2s", opacity: todo.done ? 0.75 : 1 }}>
                <div style={{ height: 4, background: `linear-gradient(90deg, ${catColor}, ${priColor})` }} />
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <button onClick={() => toggleDone(todo.id)} style={{ marginTop: 2, width: 24, height: 24, borderRadius: "50%", border: `2px solid ${todo.done ? "#22c55e" : border}`, background: todo.done ? "#22c55e" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {todo.done && <span style={{ color: "#fff", fontSize: 13 }}>✓</span>}
                    </button>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700, fontSize: 15, textDecoration: todo.done ? "line-through" : "none", color: todo.done ? muted : text }}>{todo.text}</span>
                        {todo.photo && <span style={{ fontSize: 13 }}>📷</span>}
                        {todo.note && <span style={{ fontSize: 13 }}>📝</span>}
                        {todo.reminder && <span style={{ fontSize: 13 }}>🔔</span>}
                      </div>
                      <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: catColor + "22", color: catColor }}>{todo.category}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: priColor + "22", color: priColor }}>{todo.priority === "High" ? "🔥" : todo.priority === "Medium" ? "⚡" : "🟢"} {todo.priority}</span>
                        {todo.dueDate && <span style={{ fontSize: 11, fontWeight: 600, color: isOverdue ? "#ef4444" : muted }}>{isOverdue ? "⚠️ Overdue · " : "📅 "}{formatDate(todo.dueDate)}{todo.dueTime ? ` · ${todo.dueTime}` : ""}</span>}
                        {todo.done && todo.doneAt && <span style={{ fontSize: 11, color: "#22c55e" }}>✅ {formatDate(todo.doneAt)}</span>}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => setExpandedId(isExpanded ? null : todo.id)} style={{ padding: "6px 8px", borderRadius: 8, border: `1px solid ${border}`, background: "transparent", cursor: "pointer", fontSize: 14, color: muted }}>{isExpanded ? "▲" : "▼"}</button>
                      {!todo.done && <button onClick={() => startEdit(todo)} style={{ padding: "6px 8px", borderRadius: 8, border: `1px solid ${border}`, background: "transparent", cursor: "pointer", fontSize: 14 }}>✏️</button>}
                      <button onClick={() => deleteTodo(todo.id)} style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid #ef444433", background: "#ef444411", cursor: "pointer", fontSize: 14 }}>🗑️</button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${border}` }}>
                      {todo.note && (
                        <div style={{ background: inputBg, borderRadius: 10, padding: "10px 12px", marginBottom: 10, fontSize: 14, color: text, lineHeight: 1.5 }}>
                          <strong style={{ color: muted, fontSize: 11 }}>📝 NOTE</strong>
                          <div style={{ marginTop: 4 }}>{todo.note}</div>
                        </div>
                      )}
                      {todo.photo && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: muted, marginBottom: 6 }}>📷 PHOTO</div>
                          <img src={todo.photo} alt="task" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 12, objectFit: "cover" }} />
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: muted }}>Created: {formatDate(todo.createdAt)} · {formatTime(todo.createdAt)}{todo.updatedAt ? ` · Updated: ${formatDate(todo.updatedAt)}` : ""}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {activeTab === "history" && doneTodos.length > 0 && (
          <button onClick={() => setTodos(prev => prev.filter(t => !t.done))} style={{ width: "100%", marginTop: 20, padding: "12px", borderRadius: 12, border: "1px solid #ef444444", background: "#ef444411", color: "#ef4444", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            🗑️ Clear All History
          </button>
        )}

        <div style={{ textAlign: "center", marginTop: 32, fontSize: 12, color: muted }}>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>TaskMaster · DevOps College Project</div>
          <div>Built with React.js · 5 Member Team · MCA24401</div>
        </div>
      </div>
    </div>
  );
}