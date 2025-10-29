// frontend/src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import logo from "../assets/logoshamba.jpg";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // ✅ FIXED: Correct backend URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Pre-fill email if redirected from registration
  useEffect(() => {
    if (location.state?.email) setEmail(location.state.email);
    if (location.state?.message) setMessage(`✅ ${location.state.message}`);
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("❌ Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("❌ Please enter a valid email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // ✅ FIXED: Step 1 - Check if email is registered (with /api prefix)
      const checkRes = await fetch(`${backendUrl}/api/auth/check-email`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const checkData = await checkRes.json();
      
      if (!checkData.success) {
        setMessage(checkData.error || "❌ Email not registered. Please register first.");
        setLoading(false);
        return;
      }

      // ✅ FIXED: Step 2 - Request magic link (with /api prefix)
      const res = await fetch(`${backendUrl}/api/auth/send-magic-link`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.requiresDeviceVerification) {
        // New device detected - user needs to verify via email
        setMessage("⚠️ New device detected! Please check your email to verify this device before logging in.");
      } else if (data.success) {
        // Magic link sent successfully
        setMessage("✅ Magic link sent! Check your email (and spam folder).");
      } else {
        setMessage(data.error || "❌ Failed to send magic link. Please try again.");
      }

      setEmail("");
    } catch (error) {
      console.error("❌ Error:", error);
      setMessage("❌ Network or server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <img
          src={logo}
          alt="ShambaSecure Logo"
          style={{
            width: "120px",
            height: "auto",
            display: "block",
            margin: "0 auto 20px",
          }}
        />

        <h2
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#333",
          }}
        >
          Welcome Back
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
            fontSize: "14px",
          }}
        >
          Sign in to access your ShambaSecure dashboard
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                color: "#333",
                fontSize: "14px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#ccc" : "#2c7a7b",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => {
              if (!loading) e.target.style.backgroundColor = "#234e52";
            }}
            onMouseOut={(e) => {
              if (!loading) e.target.style.backgroundColor = "#2c7a7b";
            }}
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        {message && (
          <p
            style={{
              textAlign: "center",
              color: message.startsWith("✅") ? "#28a745" : message.startsWith("⚠️") ? "#ff9800" : "#d9534f",
              marginTop: "20px",
              fontSize: "14px",
              padding: "10px",
              backgroundColor: message.startsWith("✅") ? "#d4edda" : message.startsWith("⚠️") ? "#fff3cd" : "#f8d7da",
              borderRadius: "5px",
              border: `1px solid ${message.startsWith("✅") ? "#c3e6cb" : message.startsWith("⚠️") ? "#ffeaa7" : "#f5c6cb"}`,
            }}
          >
            {message}
          </p>
        )}

        <p
          style={{
            textAlign: "center",
            marginTop: "30px",
            fontSize: "14px",
            color: "#555",
          }}
        >
          New user?{" "}
          <Link
            to="/register"
            style={{
              color: "#2c7a7b",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Register here
          </Link>
        </p>

        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "12px", color: "#999" }}>
          <p>🔒 Secure passwordless authentication</p>
        </div>
      </div>
    </div>
  );
};

export default Login;