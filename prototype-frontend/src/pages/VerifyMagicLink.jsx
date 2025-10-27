// src/pages/VerifyMagicLink.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { auth } from "../firebaseConfig"; // ✅ import from your config

const VerifyMagicLink = () => {
  const [status, setStatus] = useState("Verifying magic link...");
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");

      if (!email) {
        email = window.prompt("Please confirm your email for verification");
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem("emailForSignIn");
          setStatus("Magic link verified! Redirecting to dashboard...");
          setTimeout(() => navigate("/dashboard"), 2000);
        })
        .catch((error) => {
          console.error("Error verifying magic link:", error);
          setStatus("Verification failed. Please request a new magic link.");
        });
    } else {
      setStatus("Invalid or expired link. Please request a new one.");
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Magic Link Verification</h2>
      <p>{status}</p>
    </div>
  );
};

export default VerifyMagicLink;
