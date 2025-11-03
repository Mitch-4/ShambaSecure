# services/email_service.py - FIXED VERSION
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime


# ---------------------------------------------------------------------------
# ✅ Enhanced send_email with error handling
# ---------------------------------------------------------------------------
def send_email(recipient, subject, body):
    """
    Send email using Gmail SMTP with error handling
    Returns: True if successful, False if failed
    """
    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_APP_PASSWORD")
    sender_name = os.getenv("EMAIL_SENDER_NAME", "ShambaSecure Team")
    
    if not sender_email or not sender_password:
        print("❌ ERROR: Email credentials missing in .env")
        return False
    
    if not recipient or '@' not in recipient:
        print(f"❌ ERROR: Invalid email: {recipient}")
        return False
    
    msg = MIMEMultipart()
    msg["From"] = f"{sender_name} <{sender_email}>"
    msg["To"] = recipient
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html"))
    
    try:
        with smtplib.SMTP("smtp.gmail.com", 587, timeout=10) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        
        print(f"✅ Email sent to {recipient}")
        return True
        
    except smtplib.SMTPAuthenticationError:
        print("❌ Gmail login failed - check EMAIL_APP_PASSWORD")
        return False
    except smtplib.SMTPRecipientsRefused:
        print(f"❌ Invalid recipient: {recipient}")
        return False
    except Exception as e:
        print(f"❌ Email error: {e}")
        return False


# ---------------------------------------------------------------------------
# 📨 Magic Link Email
# ---------------------------------------------------------------------------
def send_magic_link_email(email, full_name, magic_link):
    subject = "Your ShambaSecure Magic Login Link"
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;"> ShambaSecure</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Welcome back, {full_name}! 👋</h2>
          <p style="font-size: 16px;">Click below to log in:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{magic_link}" 
               style="display:inline-block;background-color:#28a745;color:white;
                      padding:15px 40px;text-decoration:none;border-radius:8px;
                      font-weight:bold;font-size:16px;">
                Login Now
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Link expires in <strong>5 minutes</strong>.
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p>Best regards,<br><strong>ShambaSecure Team</strong></p>
        </div>
      </body>
    </html>
    """
    return send_email(email, subject, body)


# ---------------------------------------------------------------------------
# ✅ Registration Verification Email
# ---------------------------------------------------------------------------
def send_registration_verification_email(email, verification_link):
    subject = "Verify Your ShambaSecure Account"
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;"> Welcome!</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Just One More Step...</h2>
          <p>Please verify your email:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{verification_link}" 
               style="display:inline-block;background-color:#007bff;color:white;
                      padding:15px 40px;text-decoration:none;border-radius:8px;
                      font-weight:bold;">
               ✅ Verify My Email
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p>The ShambaSecure Team</p>
        </div>
      </body>
    </html>
    """
    return send_email(email, subject, body)


# ---------------------------------------------------------------------------
# 🚨 New Device Alert
# ---------------------------------------------------------------------------
def send_new_device_alert_email(email, device_info):
    subject = "New Device Login - ShambaSecure"
    current_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ff6b6b; padding: 30px; text-align: center;">
          <h1 style="color: white;">🚨 Security Alert</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>New Device Login</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>Device:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">{device_info.get('device_type', 'Unknown')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>OS:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">{device_info.get('os', 'Unknown')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>Browser:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">{device_info.get('browser', 'Unknown')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>Time:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">{current_time}</td></tr>
          </table>
          <p style="color: #d63031;"><strong>If this wasn't you, reset your password now.</strong></p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p>ShambaSecure Team</p>
        </div>
      </body>
    </html>
    """
    return send_email(email, subject, body)


# ---------------------------------------------------------------------------
# 🔐 Device Verification Email
# ---------------------------------------------------------------------------
def send_device_verification_email(email, full_name, device_info, verification_link):
    subject = "Verify New Device - ShambaSecure"
    current_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f39c12; padding: 30px; text-align: center;">
          <h1 style="color: white;"> Verify Device</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Hello {full_name},</h2>
          <p>New device detected:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>Device:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">{device_info.get('device_type', 'Unknown')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>Time:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">{current_time}</td></tr>
          </table>
          <p>If this is you, verify below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{verification_link}" 
               style="display:inline-block;background-color:#17a2b8;color:white;
                      padding:15px 40px;text-decoration:none;border-radius:8px;
                      font-weight:bold;">
               ✅ Verify Device
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p>ShambaSecure Team</p>
        </div>
      </body>
    </html>
    """
    return send_email(email, subject, body)


# ---------------------------------------------------------------------------
# 🎉 Welcome Email
# ---------------------------------------------------------------------------
def send_welcome_email(email, full_name):
    subject = "Welcome to ShambaSecure!"
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white;"> Welcome!</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Welcome, {full_name}! 🎉</h2>
          <p>Your account is ready. Your farm data is now secure.</p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p>The ShambaSecure Team</p>
        </div>
      </body>
    </html>
    """
    return send_email(email, subject, body)


# ---------------------------------------------------------------------------
# 🔔 Security Alert (new helper)
# ---------------------------------------------------------------------------
def send_security_alert_email(email, full_name, device_info):
    """
    Send a security alert email when a login occurs from a new/unusual device.
    This provides device, browser, IP and timestamp information to the user.
    """
    subject = "⚠️ New Login Detected on Your ShambaSecure Account"
    time_str = device_info.get('timestamp') or datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ff6b6b; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">⚠️ ShambaSecure Security Notice</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2>Hello {full_name},</h2>
          <p>We detected a login to your account from a new or unusual device. Details below:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>Device</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">{device_info.get('device_type', 'Unknown')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>Browser</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">{device_info.get('browser', 'Unknown')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>OS</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">{device_info.get('os', 'Unknown')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>IP Address</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">{device_info.get('ip_address', 'Unknown')}</td></tr>
            <tr><td style="padding: 10px; border: 1px solid #ddd;"><strong>Time (UTC)</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">{time_str}</td></tr>
          </table>
          <p style="color: #d63031;"><strong>If this wasn't you, please secure your account immediately and remove the unrecognized device from your account settings.</strong></p>
          <p>If you'd like assistance, reply to this email or contact support.</p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p>ShambaSecure Team</p>
        </div>
      </body>
    </html>
    """
    return send_email(email, subject, body)


# ---------------------------------------------------------------------------
# 🧠 Security Notification
# ---------------------------------------------------------------------------
def send_security_notification(email, message):
    subject = "Security Alert - ShambaSecure"
    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ff6b6b; padding: 30px; text-align: center;">
          <h1 style="color: white;">🔔 Security Update</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <p>{message}</p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p>ShambaSecure Team</p>
        </div>
      </body>
    </html>
    """
    return send_email(email, subject, body)
