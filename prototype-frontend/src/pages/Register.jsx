// frontend/src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logoshamba.jpg";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    farmName: "",
    farmLocation: "",
    farmSize: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone) {
      setMessage("❌ Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage("❌ Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9+\s-()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setMessage("❌ Please enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      // Register farmer in backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/users/register`,
        formData
      );

      if (response.data.success) {
        setMessage("✅ Registration successful! Redirecting to login...");
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login", { 
            state: { 
              email: formData.email,
              message: "Registration successful! Please sign in with your email." 
            } 
          });
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error.response?.data?.error) {
        setMessage(`❌ ${error.response.data.error}`);
      } else if (error.response?.status === 409) {
        setMessage("❌ Email already registered. Please login instead.");
      } else {
        setMessage("❌ Registration failed. Please try again.");
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
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <img 
          src={logo} 
          alt="ShambaSecure Logo" 
          style={{
            width: '100px',
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
          Farmer Registration
        </h2>
        
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          marginBottom: '30px',
          fontSize: '14px'
        }}>
          Join ShambaSecure to protect your farm
        </p>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              color: '#333',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Full Name <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              color: '#333',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Email Address <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              color: '#333',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Phone Number <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+254 700 000 000"
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Farm Name */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              color: '#333',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Farm Name
            </label>
            <input
              type="text"
              name="farmName"
              value={formData.farmName}
              onChange={handleChange}
              placeholder="e.g., Green Valley Farm"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Farm Location */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              color: '#333',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Farm Location
            </label>
            <input
              type="text"
              name="farmLocation"
              value={formData.farmLocation}
              onChange={handleChange}
              placeholder="e.g., Kiambu County"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Farm Size */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              color: '#333',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Farm Size (acres)
            </label>
            <input
              type="text"
              name="farmSize"
              value={formData.farmSize}
              onChange={handleChange}
              placeholder="e.g., 5"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Submit Button */}
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
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Registering...' : 'Register'}
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

        {/* Login Link */}
        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '14px',
          color: '#666'
        }}>
          Already have an account?{' '}
          <Link 
            to="/login" 
            style={{ 
              color: '#4CAF50', 
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;