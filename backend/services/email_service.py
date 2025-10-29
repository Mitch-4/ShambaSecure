# services/email_service.py
# Enhanced email service for ShambaSecure
# Includes: registration verification, magic link login, new device alerts, and device verification

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime
from config.firebaseConfig import db  # ✅ Firestore reference (db)
from google.cloud import firestore  # ✅ Fixes “firestore not defined” warning


# ---------------------------------------------------------------------------
# ✅ Helper: General send email function
# ---------------------------------------------------------------------------
def send_email(recipient, subject, body):
    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_APP_PASSWORD")

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = recipient
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        print(f"✅ Email sent successfully to {recipient}")
    except Exception as e:
        print(f"❌ Failed to send email to {recipient}: {e}")


# ---------------------------------------------------------------------------
# 📨 1. Magic Link Email for Login
# ---------------------------------------------------------------------------
def send_magic_link_email(email, full_name, magic_link):
    subject = "Your ShambaSecure Magic Login Link"
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Welcome back, {full_name} 👋</h2>
        <p>Click the secure link below to log in to your ShambaSecure account:</p>
        <a href="{magic_link}" 
           style="display:inline-block;background-color:#28a745;color:white;
                  padding:10px 20px;text-decoration:none;border-radius:5px;">
           Login Now
        </a>
        <p>This link will expire shortly for your security.</p>
        <p>Best regards,<br><b>ShambaSecure Security Team</b></p>
      </body>
    </html>
    """
    send_email(email, subject, body)


# ---------------------------------------------------------------------------
# ✅ 2. Registration Verification Email
# ---------------------------------------------------------------------------
def send_registration_verification_email(email, verification_link):
    subject = "Verify Your ShambaSecure Account"
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Welcome to ShambaSecure!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
        <a href="{verification_link}" 
           style="display:inline-block;background-color:#007bff;color:white;
                  padding:10px 20px;text-decoration:none;border-radius:5px;">
           Verify My Email
        </a>
        <p>If you didn’t create an account, you can safely ignore this email.</p>
        <p>Best,<br><b>ShambaSecure Team</b></p>
      </body>
    </html>
    """
    send_email(email, subject, body)


# ---------------------------------------------------------------------------
# 🚨 3. New Device Login Alert
# ---------------------------------------------------------------------------
def send_new_device_alert_email(email, device_info):
    subject = "New Device Login Detected - ShambaSecure"
    current_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>New Device Login Alert 🚨</h2>
        <p>Hello,</p>
        <p>A new device has just logged into your ShambaSecure account.</p>
        <table style="border-collapse: collapse; margin: 10px 0;">
          <tr><td><b>Device:</b></td><td>{device_info.get('device_type', 'Unknown')}</td></tr>
          <tr><td><b>Operating System:</b></td><td>{device_info.get('os', 'Unknown')}</td></tr>
          <tr><td><b>Browser:</b></td><td>{device_info.get('browser', 'Unknown')}</td></tr>
          <tr><td><b>IP Address:</b></td><td>{device_info.get('ip_address', 'Unknown')}</td></tr>
          <tr><td><b>Login Time:</b></td><td>{current_time}</td></tr>
        </table>
        <p>If this wasn’t you, please reset your password immediately and contact support.</p>
        <p>Stay secure,<br><b>ShambaSecure Security Team</b></p>
      </body>
    </html>
    """
    send_email(email, subject, body)


# ---------------------------------------------------------------------------
# 🔐 4. New Device Verification Email
# ---------------------------------------------------------------------------
def send_device_verification_email(email, full_name, device_info, verification_link):
    subject = "Verify New Device Access - ShambaSecure"
    current_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Hello {full_name},</h2>
        <p>We noticed a login attempt from a <b>new device</b> not previously associated with your account.</p>
        <table style="border-collapse: collapse; margin: 10px 0;">
          <tr><td><b>Device:</b></td><td>{device_info.get('device_type', 'Unknown')}</td></tr>
          <tr><td><b>Operating System:</b></td><td>{device_info.get('os', 'Unknown')}</td></tr>
          <tr><td><b>Browser:</b></td><td>{device_info.get('browser', 'Unknown')}</td></tr>
          <tr><td><b>IP Address:</b></td><td>{device_info.get('ip_address', 'Unknown')}</td></tr>
          <tr><td><b>Attempt Time:</b></td><td>{current_time}</td></tr>
        </table>

        <p>If this was you, please click below to verify this device:</p>
        <a href="{verification_link}" 
           style="display:inline-block;background-color:#17a2b8;color:white;
                  padding:10px 20px;text-decoration:none;border-radius:5px;">
           Verify Device
        </a>

        <p>If this wasn’t you, please secure your account immediately.</p>
        <p>Stay safe,<br><b>ShambaSecure Security Team</b></p>
      </body>
    </html>
    """

    send_email(email, subject, body)


# ---------------------------------------------------------------------------
# 🎉 5. Welcome Email (added back for import)
# ---------------------------------------------------------------------------
def send_welcome_email(email, full_name):
    """Simple welcome email sent upon successful registration"""
    subject = "Welcome to ShambaSecure!"
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Welcome aboard, {full_name}! 🌾</h2>
        <p>Your ShambaSecure account has been successfully created.</p>
        <p>We’re excited to have you with us — your farm data and devices are now protected.</p>
        <p>Stay secure,<br><b>The ShambaSecure Team</b></p>
      </body>
    </html>
    """
    send_email(email, subject, body)


# ---------------------------------------------------------------------------
# 🧠 6. Security Notification (optional use)
# ---------------------------------------------------------------------------
def send_security_notification(email, message):
    """Send a general security-related alert"""
    subject = "Security Notification - ShambaSecure"
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2>Account Security Update</h2>
        <p>{message}</p>
        <p>For any concerns, contact our support team immediately.</p>
        <p>— ShambaSecure Security Team</p>
      </body>
    </html>
    """
    send_email(email, subject, body)
