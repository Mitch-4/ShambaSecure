// frontend/src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import logo from "../assets/logoshamba.jpg";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Pre-fill email if coming from registration
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (location.state?.message) {
      setMessage(`✅ ${location.state.message}`);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("❌ Please enter your email");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("❌ Please enter a valid email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Configure action code settings
      const actionCodeSettings = {
        url: 'http://localhost:5173/verify-magic-link',
        handleCodeInApp: true,
      };

      // Send sign-in link to email
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      // Save email locally
      window.localStorage.setItem('emailForSignIn', email);

      setMessage("✅ Magic link sent! Check your email (and spam folder).");
      setEmail("");
    } catch (error) {
      console.error("Error sending magic link:", error);

      if (error.code === 'auth/invalid-email') {
        setMessage("❌ Invalid email address");
      } else if (error.code === 'auth/unauthorized-continue-uri') {
        setMessage("❌ Configuration error. Please contact support.");
      } else if (error.code === 'auth/user-not-found') {
        setMessage("❌ Email not registered. Please register first.");
      } else {
        setMessage(`❌ Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <img 
          src={logo} 
          alt="ShambaSecure Logo" 
          style={{
            width: '120px',
            height: 'auto',
            display: 'block',
            margin: '0 auto 20px'
          }}
        />
        
        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '10px',
          color: '#333'
        }}>
          Welcome Back
        </h2>
        
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          marginBottom: '30px',
          fontSize: '14px'
        }}>
          Sign in to access your ShambaSecure dashboard
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              color: '#333',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                boxSizing: 'border-box',
                backgroundColor: loading ? '#f9f9f9' : 'white'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            {loading ? 'Sending...' : '🔐 Send Magic Link'}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            borderRadius: '5px',
            backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
            textAlign: 'center',
            fontSize: '14px',
            border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message}
          </div>
        )}

        {/* Info Box */}
        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '5px',
          fontSize: '12px',
          color: '#004085'
        }}>
          <strong> How it works:</strong><br />
          Enter your email and we'll send you a secure link. Click the link to sign in instantly - no password needed!
        </div>

        {/* Register Link */}
        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '14px',
          color: '#666'
        }}>
          Don't have an account?{' '}
          <Link 
            to="/register" 
            style={{ 
              color: '#4CAF50', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Register here
          </Link>
        </p>

        <p style={{
          textAlign: 'center',
          marginTop: '15px',
          fontSize: '12px',
          color: '#999'
        }}>
          🔒 Secure passwordless authentication
        </p>
      </div>
    </div>
  );
};

export default Login;