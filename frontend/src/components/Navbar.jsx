import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar({ darkMode, setDarkMode }) {
  const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <Link to="/" className="modern-brand">

  <div className="brand-logo">
    CR
  </div>

  <div className="brand-text">
    <span>Car</span>Rental
  </div>

</Link>
      <div className="nav-right">

  <NavLink to="/cars">Cars</NavLink>

  {user?.role === "customer" && (
    <NavLink to="/dashboard">My Bookings</NavLink>
  )}

  {user?.role === "admin" && (
    <NavLink to="/admin">Admin</NavLink>
  )}

  {!user && <NavLink to="/login">Login</NavLink>}

  {!user && <NavLink to="/register">Register</NavLink>}

  <button
    className="theme-toggle"
    onClick={() => setDarkMode(!darkMode)}
  >
    {darkMode ? "☀️" : "🌙"}
  </button>

  {user && (
    <>
      <span style={{ marginRight: 12 }}>
        👤 {user.username}
      </span>

      <button
        className="btn btn-secondary"
        onClick={logout}
      >
        Logout
      </button>
    </>
  )}

</div>
    </nav>
  );
}
