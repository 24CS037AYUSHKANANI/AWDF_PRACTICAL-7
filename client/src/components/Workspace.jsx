import { useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  me,
  signOut,
  tasks,
  toggleTask
} from "../lib/api";

export default function Workspace({ onLogout, notify }) {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [filter, setFilter] = useState("all");

  async function refresh() {
    try {
      setLoading(true);
      const [profile, result] = await Promise.all([me(), tasks()]);
      setUser(profile.user);
      setItems(result.tasks || []);
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();

    const expired = () => {
      onLogout();
      notify("Your session expired. Please sign in again.", "error");
    };

    window.addEventListener("session-expired", expired);
    return () => window.removeEventListener("session-expired", expired);
  }, []);

  async function submit(event) {
    event.preventDefault();

    try {
      setBusy(true);

      const result = await createTask({
        title,
        description,
        priority
      });

      setItems(current => [result.task, ...current]);
      setTitle("");
      setDescription("");
      setPriority("medium");
      notify("Task added to your workspace");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function complete(task) {
    try {
      setBusy(true);

      const result = await toggleTask(task._id, {
        title: task.title,
        completed: !task.completed,
        priority: task.priority
      });

      setItems(current =>
        current.map(item => item._id === task._id ? result.task : item)
      );

      notify(task.completed ? "Task reopened" : "Task completed");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Remove this task permanently?")) return;

    try {
      setBusy(true);
      await deleteTask(id);
      setItems(current => current.filter(item => item._id !== id));
      notify("Task removed");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    signOut();
    onLogout();
  }

  const visible = items.filter(task => {
    if (filter === "open") return !task.completed;
    if (filter === "done") return task.completed;
    return true;
  });

  const completed = items.filter(item => item.completed).length;
  const open = items.length - completed;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader" />
        <p>Opening your secure workspace...</p>
      </div>
    );
  }

  return (
    <main className="workspace">
      <nav className="topbar">
        <div className="logo">
          <span>A</span>
          <div>
            <strong>AYUSH</strong>
            <small>24CS037</small>
          </div>
        </div>

        <div className="nav-right">
          <div className="profile">
            <div className="avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{user?.email}</strong>
              <small>Authenticated user</small>
            </div>
          </div>
          <button className="logout-button" onClick={logout}>Log out</button>
        </div>
      </nav>

      <section className="hero">
        <div>
          <span className="eyebrow dark">PERSONAL COMMAND CENTER</span>
          <h1>Good to see you,<br /><em>Ayush.</em></h1>
          <p>
            Your tasks are protected by JWT authentication and stored in
            MongoDB. Every write passes through server-side validation.
          </p>
        </div>

        <div className="stats">
          <div>
            <strong>{items.length}</strong>
            <span>Total</span>
          </div>
          <div>
            <strong>{open}</strong>
            <span>Open</span>
          </div>
          <div>
            <strong>{completed}</strong>
            <span>Done</span>
          </div>
        </div>
      </section>

      <section className="workspace-grid">
        <aside className="composer">
          <div className="section-label">NEW TASK</div>
          <h2>Capture an idea.</h2>
          <p>It will be validated before it reaches MongoDB.</p>

          <form onSubmit={submit}>
            <label>Task title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Finish Practical 7"
              required
            />

            <label>Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="A little context..."
              rows="5"
            />

            <label>Priority</label>
            <div className="priority-picker">
              {["low", "medium", "high"].map(level => (
                <button
                  type="button"
                  key={level}
                  className={priority === level ? `selected ${level}` : ""}
                  onClick={() => setPriority(level)}
                >
                  {level}
                </button>
              ))}
            </div>

            <button className="add-button" disabled={busy}>
              {busy ? "Saving..." : "Add task  +"}
            </button>
          </form>

          <div className="pipeline">
            <span>AUTH</span>
            <b>→</b>
            <span>VALIDATE</span>
            <b>→</b>
            <span>DATABASE</span>
          </div>
        </aside>

        <section className="task-area">
          <div className="task-toolbar">
            <div>
              <div className="section-label">YOUR WORK</div>
              <h2>Task board</h2>
            </div>

            <div className="filters">
              {[
                ["all", "All"],
                ["open", "Open"],
                ["done", "Done"]
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={filter === value ? "active" : ""}
                  onClick={() => setFilter(value)}
                >
                  {label}
                </button>
              ))}
              <button className="refresh" onClick={refresh}>↻</button>
            </div>
          </div>

          <div className="tasks">
            {visible.length === 0 ? (
              <div className="empty-state">
                <div>✓</div>
                <h3>Nothing here yet</h3>
                <p>Add a task or switch the filter.</p>
              </div>
            ) : (
              visible.map(task => (
                <article
                  className={`task-row ${task.completed ? "completed" : ""}`}
                  key={task._id}
                >
                  <button
                    className="check"
                    onClick={() => complete(task)}
                    disabled={busy}
                    aria-label="toggle task"
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  <div className="task-copy">
                    <h3>{task.title}</h3>
                    <p>{task.description || "No description added."}</p>
                    <div className="task-meta">
                      <span className={`pill ${task.priority}`}>
                        {task.priority}
                      </span>
                      <span>{task.completed ? "Completed" : "In progress"}</span>
                    </div>
                  </div>

                  <button
                    className="delete"
                    onClick={() => remove(task._id)}
                    disabled={busy}
                  >
                    ×
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      </section>

      <footer>
        <span>AWDF PRACTICAL 7</span>
        <span>JWT · bcrypt · Express · Mongoose · MongoDB</span>
        <span>24CS037</span>
      </footer>
    </main>
  );
}
