// src/pages/Dashboard.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../App.css";
import logo from "../assets/logoshamba.jpg"; 

// Example IoT sensor data (this can later come from an API)
const sensorData = [
  { time: "8AM", humidity: 65, temperature: 24, soil: 40 },
  { time: "10AM", humidity: 68, temperature: 25, soil: 42 },
  { time: "12PM", humidity: 70, temperature: 26, soil: 45 },
  { time: "2PM", humidity: 66, temperature: 27, soil: 47 },
  { time: "4PM", humidity: 64, temperature: 26, soil: 44 },
];

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* ===== Header ===== */}
      <div className="dashboard-top">
        <div className="dashboard-title">
          <img src={logo} alt="ShambaSecure Logo" className="dashboard-logo" />
          <div>
            <h1>Shamba Dashboard</h1>
            <p>Welcome back, Farmer! Monitor your farm’s vital signs below:</p>
          </div>
        </div>
      </div>

      {/* ===== Sensor Overview ===== */}
      <div className="sensor-grid">
        <div className="sensor-card humidity">
          💧 Humidity <br /> <span>68%</span>
        </div>
        <div className="sensor-card soil">
          🌱 Soil Moisture <br /> <span>45%</span>
        </div>
        <div className="sensor-card temperature">
          🌡️ Temperature <br /> <span>26°C</span>
        </div>
      </div>

      {/* ===== Chart Section ===== */}
      <div className="chart-section">
        <h2>Sensor Data Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sensorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="humidity" stroke="#1e88e5" strokeWidth={2} />
            <Line type="monotone" dataKey="soil" stroke="#2e7d32" strokeWidth={2} />
            <Line type="monotone" dataKey="temperature" stroke="#c62828" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
