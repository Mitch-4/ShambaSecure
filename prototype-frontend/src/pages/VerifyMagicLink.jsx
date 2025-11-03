import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../firebaseConfig";
import axios from "axios";

export default function VerifyMagicLink() {
  const [message, setMessage] = useState("Verifying your login...");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyToken = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      if (!token) {
        setMessage("❌ Invalid or missing login token.");
        setIsError(true);
        return;
      }

      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";

        // ✅ Verify token with backend
        const response = await axios.post(
          `${backendUrl}/api/auth/verify-token`,
          { token },
          { headers: { "Content-Type": "application/json" } }
        );

        const { success, customToken, user, warning, error } = response.data;

        if (success) {
          // ✅ Sign in to Firebase with custom token
          await signInWithCustomToken(auth, customToken);

          // ✅ Store user data in localStorage
          localStorage.setItem("user", JSON.stringify(user));

          // ⚠️ If backend flagged device mismatch, show warning but still log in
          if (warning === "device_mismatch") {
            setMessage(
              "⚠️ You’re logging in from a new device. Please confirm this is you."
            );
            setIsError(false);
            setTimeout(() => {
              navigate("/dashboard");
            }, 2500);
            return;
          }

          // ✅ Normal success case
          setMessage("✅ Login successful! Redirecting to dashboard...");
          setIsError(false);

          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        } else {
          // ❌ Backend returned failure
          setMessage(`❌ ${error || "Invalid or expired link."}`);
          setIsError(true);
          setTimeout(() => navigate("/login"), 5000);
        }
      } catch (err) {
        console.error("Verification error:", err);
        const errorMessage =
          err.response?.data?.error ||
          "Invalid or expired link. Please request a new one.";
        setMessage(`❌ ${errorMessage}`);
        setIsError(true);

        setTimeout(() => {
          navigate("/login");
        }, 5000);
      }
    };

    verifyToken();
  }, [location, navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Loading spinner */}
        {!isError && (
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #4CAF50",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          />
        )}

        {isError && (
          <div
            style={{
              fontSize: "48px",
              marginBottom: "20px",
            }}
          >
            ⚠️
          </div>
        )}

        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: isError ? "#d9534f" : "#333",
            marginBottom: "10px",
          }}
        >
          Magic Link Verification
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: isError ? "#d9534f" : "#666",
            lineHeight: "1.6",
          }}
        >
          {message}
        </p>

        {isError && (
          <button
            onClick={() => navigate("/login")}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: "600",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "#45a049")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "#4CAF50")
            }
          >
            Request New Link
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
