import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Menu from "./pages/Menu.jsx";
import Orders from "./pages/Orders.jsx";
import Profile from "./pages/Profile.jsx";

// Pages that need a logged-in user redirect to /login otherwise
function Protected({ userId, children }) {
  return userId ? children : <Navigate to="/login" replace />;
}

export default function App() {
  // The login state lives in localStorage so it survives a page refresh
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  const handleLogin = (user) => {
    localStorage.setItem("userId", user.id);
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userAddress", user.address);
    setUserId(String(user.id));
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userAddress");
    setUserId(null);
  };

  return (
    <>
      <Navbar isLoggedIn={!!userId} onLogout={handleLogout} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/menu" element={<Menu isLoggedIn={!!userId} />} />
          <Route path="/orders" element={<Protected userId={userId}><Orders /></Protected>} />
          <Route path="/profile" element={<Protected userId={userId}><Profile /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
