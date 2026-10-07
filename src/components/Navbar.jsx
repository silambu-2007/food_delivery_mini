import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

export default function Navbar({ isLoggedIn, onLogout }) {
  const [open, setOpen] = useState(false); // mobile menu
  const navigate = useNavigate();

  const close = () => setOpen(false);

  const logout = () => {
    onLogout(); // removes userId from localStorage
    close();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-dot" /> FoodDelivery
        </Link>

        <button className="nav-toggle" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" end onClick={close}>Home</NavLink>
          <NavLink to="/menu" onClick={close}>Menu</NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/orders" onClick={close}>My Orders</NavLink>
              <NavLink to="/profile" onClick={close}>Profile</NavLink>
              <button className="btn btn-outline btn-sm" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>Login</NavLink>
              <NavLink to="/register" onClick={close} className="btn btn-primary btn-sm">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
