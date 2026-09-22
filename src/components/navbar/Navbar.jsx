import { useState } from "react";
import "./Navbar.css";

import {
  FaBell,
  FaCalendarAlt,
  FaUserCircle,
  FaSearch,
  FaTimes
} from "react-icons/fa";

function Navbar() {
  const today = new Date();

  const day = today.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const date = today.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const [showLogin, setShowLogin] = useState(false);
  const [role, setRole] = useState("Staff");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage("Please enter username and password.");
      setSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setMessage(data.message);

        setTimeout(() => {
          setShowLogin(false);
          setUsername("");
          setPassword("");
          setMessage("");
          setSuccess(false);
        }, 1500);
      } else {
        setSuccess(false);
        setMessage(data.error || "Invalid login details.");
      }
    } catch (error) {
      setSuccess(false);
      setMessage(
        "Unable to connect to the server. Make sure Flask is running."
      );
    }

    setLoading(false);
  };

  return (
    <>
      <header className="navbar">

        <div className="searchContainer">
          <FaSearch className="searchIcon" />

          <input
            type="text"
            placeholder="Search Resident..."
          />
        </div>

        <div className="rightSection">

          <div className="dateSection">
            <h4>{day}</h4>
            <p>{date}</p>
          </div>

          <div className="navIcons">
            <button>
              <FaBell />
            </button>

            <button>
              <FaCalendarAlt />
            </button>
          </div>

          <button
            className="loginBtn"
            onClick={() => setShowLogin(true)}
          >
            <FaUserCircle />
            <span>Login</span>
          </button>

        </div>
      </header>


      {/* LOGIN POPUP */}

      {showLogin && (
        <div
          className="loginOverlay"
          onClick={() => setShowLogin(false)}
        >

          <div
            className="loginModal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="closeLogin"
              onClick={() => setShowLogin(false)}
            >
              <FaTimes />
            </button>

            <div className="loginIcon">
              <FaUserCircle />
            </div>

            <h2>Login</h2>

            <p className="loginSubtitle">
              Login to Elderly Home Management System
            </p>

            <form onSubmit={handleLogin}>

              <label>Login As</label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>


              <label>Username</label>

              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />


              <label>Password</label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />


              {message && (
                <div
                  className={
                    success
                      ? "loginMessage successMessage"
                      : "loginMessage errorMessage"
                  }
                >
                  {message}
                </div>
              )}


              <button
                type="submit"
                className="submitLogin"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

          </div>

        </div>
      )}
    </>
  );
}

export default Navbar;