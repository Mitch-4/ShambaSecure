import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import VerifyMagicLink from "./pages/VerifyMagicLink";
import logo from "./assets/logoshamba.jpg";
import axios from "axios";

function App() {
  const navigate = useNavigate();

  const handleMagicLink = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    // ✅ Save the email locally for Firebase verification later
  window.localStorage.setItem("emailForSignIn", email);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/send-magic-link`,
        { email }
      );

      alert("✅ Magic link sent! Check your email or console for testing.");
      console.log("Magic Link:", response.data.link);
    } catch (error) {
      console.error("Error sending magic link:", error);
      alert("❌ Failed to send magic link.");
    }
  };

  return (
    <Routes>
      {/* Login Page */}
      <Route
        path="/"
        element={
          <div className="login-container">
            <div className="login-card">
              <img src={logo} alt="ShambaSecure Logo" className="logo" />
              <p>Enter your email to receive a magic link.</p>

              <form onSubmit={handleMagicLink}>
                <input type="email" name="email" placeholder="Email" required />
                <button type="submit">Send Magic Link</button>
              </form>
            </div>
          </div>
        }
      />

      {/* Verification Page */}
      <Route path="/verify-magic-link" element={<VerifyMagicLink />} />

      {/* Dashboard Page */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
