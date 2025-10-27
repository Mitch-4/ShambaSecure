// frontend/src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    if (!formData.fullName || !formData.email || !formData.phone) {
      setMessage("❌ Please fill in all required fields");
      setLoading(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setMessage("❌ Please enter a valid email address");
      setLoading(false);
      return;
    }

    const phoneRegex = /^[0-9+\s-()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setMessage("❌ Please enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/users/register`,
        {
          ...formData,
          email: formData.email.toLowerCase().trim(),
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim()
        }
      );

      if (response.data.success) {
        setMessage("✅ Registration successful! Redirecting to login...");
        
        setTimeout(() => {
          navigate("/login", { 
            state: { 
              email: formData.email.toLowerCase().trim(),
              message: "Account created! Please sign in with your email." 
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

  const inputStyle = (disabled) => ({
    width: '100%',
    padding: '12px 14px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px',
    boxSizing: 'border-box',
    backgroundColor: disabled ? '#f9f9f9' : 'white',
    color: '#333',
    outline: 'none',
    transition: 'all 0.3s',
    fontFamily: 'inherit'
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '550px',
        width: '100%',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '35px 30px',
          textAlign: 'center',
          color: 'white'
        }}>
          <img 
            src={logo} 
            alt="ShambaSecure" 
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              border: '4px solid white',
              marginBottom: '15px',
              objectFit: 'cover'
            }}
          />
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '600' }}>
            Join ShambaSecure
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '15px' }}>
            Protect your farm with smart technology
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '35px 30px' }}>
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                color: '#333',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Full Name <span style={{ color: '#e74c3c' }}>*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={loading}
                style={inputStyle(loading)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                color: '#333',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Email Address <span style={{ color: '#e74c3c' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                disabled={loading}
                autoComplete="email"
                style={inputStyle(loading)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                color: '#333',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                Phone Number <span style={{ color: '#e74c3c' }}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+254 700 000 000"
                required
                disabled={loading}
                style={inputStyle(loading)}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e0e0e0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Farm Details Section */}
            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '18px'
            }}>
              <h3 style={{
                margin: '0 0 15px 0',
                fontSize: '16px',
                color: '#333',
                fontWeight: '600'
              }}>
                🌾 Farm Details (Optional)
              </h3>

              {/* Farm Name */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  color: '#555',
                  fontSize: '13px',
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
                  style={inputStyle(loading)}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              {/* Farm Location */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  color: '#555',
                  fontSize: '13px',
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
                  style={inputStyle(loading)}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              {/* Farm Size */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  color: '#555',
                  fontSize: '13px',
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
                  style={inputStyle(loading)}
                  onFocus={(e) => e.target.style.borderColor = '#667eea'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
            >
              {loading ? 'Creating Account...' : '✨ Create Account'}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div style={{
              marginTop: '20px',
              padding: '14px',
              borderRadius: '10px',
              backgroundColor: message.includes('✅') ? '#d4edda' : '#f8d7da',
              color: message.includes('✅') ? '#155724' : '#721c24',
              border: `1px solid ${message.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              {message}
            </div>
          )}

          {/* Login Link */}
          <div style={{
            marginTop: '25px',
            textAlign: 'center',
            padding: '15px',
            background: '#f8f9fa',
            borderRadius: '10px'
          }}>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#666'
            }}>
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textDecoration: 'underline',
                  padding: 0
                }}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;