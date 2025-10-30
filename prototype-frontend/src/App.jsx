import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Dashboard from "./pages/Dashboard";
import VerifyMagicLink from "./pages/VerifyMagicLink";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyDevice from "./pages/VerifyDevice";
import logo from "./assets/logoshamba.jpg";

function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleMagicLink = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    if (!email) {
      setMessage("❌ Please enter your email");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const actionCodeSettings = {
        // This is where Firebase will redirect the user after clicking the link
        url: "http://localhost:5173/auth/verify-device",
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setMessage("✅ Magic link sent! Check your email (and spam folder).");
      e.target.reset();
    } catch (error) {
      console.error("Error sending magic link:", error);

      if (error.code === "auth/invalid-email") {
        setMessage("❌ Invalid email address");
      } else if (error.code === "auth/unauthorized-continue-uri") {
        setMessage("❌ Domain not authorized. Check Firebase Console.");
      } else if (error.code === "auth/missing-continue-uri") {
        setMessage("❌ Configuration error. Check actionCodeSettings.");
      } else {
        setMessage(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Routes>
      {/* 🔹 Default Login Page with Magic Link */}
      <Route
        path="/"
        element={
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
                style={{ textAlign: "center", marginBottom: "10px", color: "#333" }}
              >
                Welcome to ShambaSecure
              </h2>
              <p
                style={{
                  textAlign: "center",
                  color: "#666",
                  marginBottom: "30px",
                  fontSize: "14px",
                }}
              >
                Enter your email to receive a magic link.
              </p>

              <form onSubmit={handleMagicLink}>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "15px",
                    fontSize: "16px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    backgroundColor: loading ? "#f9f9f9" : "white",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    fontSize: "16px",
                    backgroundColor: loading ? "#ccc" : "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                    transition: "background-color 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    !loading && (e.target.style.backgroundColor = "#45a049")
                  }
                  onMouseLeave={(e) =>
                    !loading && (e.target.style.backgroundColor = "#4CAF50")
                  }
                >
                  {loading ? "Sending..." : "Send Magic Link"}
                </button>
              </form>

              {message && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "12px",
                    borderRadius: "5px",
                    backgroundColor: message.includes("✅")
                      ? "#d4edda"
                      : "#f8d7da",
                    color: message.includes("✅") ? "#155724" : "#721c24",
                    textAlign: "center",
                    fontSize: "14px",
                    border: `1px solid ${
                      message.includes("✅") ? "#c3e6cb" : "#f5c6cb"
                    }`,
                  }}
                >
                  {message}
                </div>
              )}

              <p
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  fontSize: "12px",
                  color: "#999",
                }}
              >
                🔒 Secure passwordless authentication
              </p>

              <p
                style={{
                  textAlign: "center",
                  marginTop: "15px",
                  fontSize: "14px",
                }}
              >
                <a href="/register" style={{ color: "#4CAF50", textDecoration: "none" }}>
                  Don't have an account? Register
                </a>
              </p>
            </div>
          </div>
        }
      />

      {/* 🔹 Other Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/verify" element={<VerifyMagicLink />} /> {/* ✅ ADDED: Handles /auth/verify?token=... */}
      <Route path="/verify-magic-link" element={<VerifyMagicLink />} />
      <Route path="/auth/verify-device" element={<VerifyDevice />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;