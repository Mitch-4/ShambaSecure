import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function VerifyDevice() {
  const [message, setMessage] = useState("Verifying your device...");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyDevice = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      if (!token) {
        setMessage("❌ Invalid or missing verification token.");
        setIsError(true);
        return;
      }

      try {
        // ✅ Use POST method with token in body (matches backend)
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:5000";
        
        const response = await axios.post(
          `${backendUrl}/api/auth/verify-device`,
          { token }, // Send token in request body
          {
            headers: { "Content-Type": "application/json" }
          }
        );

        if (response.data.success) {
          setMessage("✅ Device verified! Magic link sent to your email. Please check your inbox.");
          setIsError(false);
          
          // Redirect to login after 10 seconds
          setTimeout(() => {
            navigate("/login", { 
              state: { 
                message: "Device verified! Check your email for the magic link to sign in." 
              } 
            });
          }, 3000);
        }
      } catch (err) {
        console.error("Verification error:", err);
        
        const errorMessage = err.response?.data?.error || "Verification failed or link expired.";
        setMessage(`❌ ${errorMessage}`);
        setIsError(true);
        
        // Redirect to login after 10 seconds on error
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      }
    };

    verifyDevice();
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
        {/* Loading spinner or icon */}
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
          Device Verification
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
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          >
            Back to Login
          </button>
        )}
      </div>

      {/* CSS animation for spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}