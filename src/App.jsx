import { useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, done: false }]);
    setInput("");
  };

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id));

  return (
    <div style={{ maxWidth: 500, margin: "60px auto", fontFamily: "Arial, sans-serif", padding: "0 20px" }}>
      <h1 style={{ textAlign: "center", color: "#4f46e5" }}>📝 To-Do List</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a new task..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #ccc", fontSize: 16 }}
        />
        <button
          onClick={addTodo}
          style={{ padding: "10px 20px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 16 }}
        >
          Add
        </button>
      </div>

      {todos.length === 0 && (
        <p style={{ textAlign: "center", color: "#999" }}>No tasks yet. Add one above!</p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", marginBottom: 8, background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              style={{ width: 18, height: 18, cursor: "pointer" }}
            />
            <span style={{ flex: 1, fontSize: 16, textDecoration: todo.done ? "line-through" : "none", color: todo.done ? "#999" : "#111" }}>
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{ background: "none", border: "none", color: "#ef4444", fontSize: 18, cursor: "pointer" }}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <p style={{ textAlign: "center", color: "#6b7280", fontSize: 14 }}>
          {todos.filter((t) => t.done).length} / {todos.length} tasks completed
        </p>
      )}
    </div>
  );
}

export default App;