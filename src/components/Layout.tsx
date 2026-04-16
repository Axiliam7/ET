import { NavLink, Outlet } from "react-router-dom";
import { primeTimeChapter } from "../data/primeTimeChapter";
import { confirmReturnToDashboard } from "../utils/sessionTracking";

export function Layout() {
  const { meta, lessons } = primeTimeChapter;
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <p className="brand">{meta.title}</p>
        <p className="brand-sub">
          {meta.grade} · {meta.unit}
        </p>
        <nav aria-label="Chapter sections">
          <div className="nav-section">Overview</div>
          <ul className="nav-list">
            <li>
              <NavLink end to="/" className={({ isActive }) => (isActive ? "active" : "")}>
                Start &amp; how it adapts
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/progress"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Progress &amp; recommendations
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/assessment"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Unit assessment
              </NavLink>
            </li>
          </ul>
          <div className="nav-section">Lessons</div>
          <ul className="nav-list">
            {lessons.map((l) => (
              <li key={l.id}>
                <NavLink
                  to={`/lesson/${l.slug}`}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {l.order}. {l.shortTitle}
                </NavLink>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "1rem" }}>
            <button type="button" className="btn" onClick={() => void confirmReturnToDashboard()}>
              Return to Dashboard
            </button>
          </div>
        </nav>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
