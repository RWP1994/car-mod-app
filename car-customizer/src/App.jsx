import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import GaragePage from "./pages/GaragePage";
import Register from './pages/Register';

import GarageGallery from "./components/GarageGallery"; // ✅ import community page
import Login from "./pages/Login";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = ({ user }) => {
    setUser(user);
    alert(`Welcome, ${user.username}!`);
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };
  

  return (
    <Router>
      <header className="app-header">
        <nav className="navbar">
          <div className="nav-left">
            <Link to="/">Home</Link>
            <Link to="/garage">Garage</Link>
            <Link to="/community">Community</Link>
          </div>
          <div className="nav-right">
            {user ? (
              <>
                <span className="greeting">Hi, {user.username}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </div>
        </nav>
      </header>
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/garage" element={<GaragePage />} />
        <Route path="/community" element={<GarageGallery />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleLogin} />} />

      </Routes>
    </Router>
  );
  
}

export default App;
