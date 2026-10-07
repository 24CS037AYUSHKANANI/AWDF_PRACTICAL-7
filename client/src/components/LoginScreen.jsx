import { useState } from "react";
import { login, register, tokenKey } from "../lib/api";

export default function LoginScreen({ onAuthenticated, notify }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();

    try {
      setBusy(true);

      if (mode === "register") {
        await register(email, password);
        notify("Account created. Sign in to continue.");
        setMode("login");
      } else {
        const result = await login(email, password);
        localStorage.setItem(tokenKey, result.token);
        onAuthenticated();
      }
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-shell">
      <section className="visual-side">
        <div className="orb orb-one" />
        <div className="orb orb-two" />

        <div className="visual-content">
          <div className="eyebrow">AWDF · PRACTICAL 07</div>
          <h1>Work smart.<br /><em>Stay secure.</em></h1>
          <p>
            A JWT-protected task workspace built by Ayush Kanani.
            Authentication, validation and database access work together
            through the Express middleware pipeline.
          </p>

          <div className="mini-flow">
            <span>React</span>
            <b>→</b>
            <span>JWT</span>
            <b>→</b>
            <span>Express</span>
            <b>→</b>
            <span>MongoDB</span>
          </div>

          <div className="student-badge">
            <strong>AYUSH KANANI</strong>
            <span>24CS037</span>
          </div>
        </div>
      </section>

      <section className="form-side">
        <div className="form-card">
          <div className="mark">A</div>
          <div className="form-heading">
            <span>PRIVATE WORKSPACE</span>
            <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
            <p>
              {mode === "login"
                ? "Sign in to access your protected tasks."
                : "Register a secure account for the task workspace."}
            </p>
          </div>

          <div className="mode-switch">
            <button
              className={mode === "login" ? "chosen" : ""}
              onClick={() => setMode("login")}
            >
              Sign in
            </button>
            <button
              className={mode === "register" ? "chosen" : ""}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          <form onSubmit={submit}>
            <div className="field">
              <label>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ayush24cs037@example.com"
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength="6"
                required
              />
            </div>

            <button className="submit-button" disabled={busy}>
              {busy
                ? "Authenticating..."
                : mode === "login"
                  ? "Enter workspace →"
                  : "Create secure account →"}
            </button>
          </form>

          <div className="security-note">
            <span>✓</span>
            Passwords are hashed with bcrypt before storage.
          </div>
        </div>
      </section>
    </main>
  );
}
