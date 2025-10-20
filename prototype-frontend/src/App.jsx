import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import logo from "./assets/logoshamba.jpg"; 

function App() {
  const navigate = useNavigate();

  const handleMagicLink = (e) => {
    e.preventDefault(); // prevent form reload
    navigate("/dashboard"); // simulate magic link navigation
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
            
              <p>Enter your email to receive link.</p>

              <form onSubmit={handleMagicLink}>
                <input type="email" placeholder="Email" required />
                <button type="submit">Send Magic Link</button>
              </form>
            </div>
          </div>
        }
      />

      {/* Dashboard Page */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
