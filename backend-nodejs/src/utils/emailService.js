// backend/src/utils/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter with optimized settings for deliverability
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  // Additional settings to improve deliverability
  tls: {
    rejectUnauthorized: true
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service configuration error:', error);
  } else {
    console.log('✅ Email service is ready');
  }
});

/**
 * Send magic link email to user
 * Optimized to avoid spam filters
 */
export const sendMagicLinkEmail = async (email, fullName, magicLink) => {
  const firstName = fullName.split(' ')[0]; // Extract first name
  
  const mailOptions = {
    from: {
      name: 'ShambaSecure Team',
      address: process.env.EMAIL_USER
    },
    to: email,
    subject: 'Your Secure Login Link - ShambaSecure', // Clear, non-spammy subject
    // Plain text version (important for spam filters)
    text: `
Hello ${firstName},

You requested to sign in to your ShambaSecure account.

Click this link to securely log in:
${magicLink}

This link will expire in 15 minutes for your security.

If you didn't request this, please ignore this email or contact our support team.

Best regards,
The ShambaSecure Team

--
ShambaSecure - Smart Farm Management
This is an automated message, please do not reply to this email.
    `.trim(),
    // HTML version
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ShambaSecure Login</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f5f5f5;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .email-header {
            background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #ffffff;
            margin: 0;
            text-decoration: none;
          }
          .logo-icon {
            display: inline-block;
            margin-right: 8px;
          }
          .email-body {
            padding: 40px 30px;
            background-color: #ffffff;
          }
          .greeting {
            font-size: 24px;
            color: #2e7d32;
            margin: 0 0 20px 0;
            font-weight: 600;
          }
          .message {
            font-size: 16px;
            color: #555555;
            margin: 0 0 30px 0;
            line-height: 1.7;
          }
          .cta-button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
            transition: transform 0.2s;
          }
          .cta-container {
            text-align: center;
            margin: 30px 0;
          }
          .alternative-link {
            margin: 30px 0;
            padding: 20px;
            background-color: #f9f9f9;
            border-left: 4px solid #4caf50;
            border-radius: 4px;
          }
          .alternative-link p {
            margin: 0 0 10px 0;
            font-size: 14px;
            color: #666666;
          }
          .link-text {
            word-break: break-all;
            font-size: 12px;
            color: #2e7d32;
            font-family: monospace;
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
          }
          .security-notice {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px 20px;
            margin: 30px 0;
            border-radius: 4px;
          }
          .security-notice h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #856404;
          }
          .security-notice ul {
            margin: 10px 0;
            padding-left: 20px;
            color: #856404;
          }
          .security-notice li {
            margin: 5px 0;
            font-size: 14px;
          }
          .email-footer {
            background-color: #f9f9f9;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
          }
          .footer-text {
            font-size: 14px;
            color: #666666;
            margin: 5px 0;
          }
          .footer-links {
            margin: 15px 0;
          }
          .footer-link {
            color: #2e7d32;
            text-decoration: none;
            margin: 0 10px;
            font-size: 14px;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-link {
            display: inline-block;
            margin: 0 8px;
            color: #666666;
            text-decoration: none;
          }
          @media only screen and (max-width: 600px) {
            .email-header {
              padding: 30px 20px;
            }
            .email-body {
              padding: 30px 20px;
            }
            .greeting {
              font-size: 20px;
            }
            .cta-button {
              display: block;
              padding: 14px 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <!-- Header -->
          <div class="email-header">
            <div class="logo">
              <span class="logo-icon">🌾</span>
              ShambaSecure
            </div>
          </div>

          <!-- Body -->
          <div class="email-body">
            <h1 class="greeting">Hello ${firstName}! 👋</h1>
            
            <p class="message">
              You requested to sign in to your ShambaSecure account. Click the button below to securely access your farm management dashboard.
            </p>

            <!-- CTA Button -->
            <div class="cta-container">
              <a href="${magicLink}" class="cta-button">
                🔐 Sign In to ShambaSecure
              </a>
            </div>

            <!-- Alternative Link -->
            <div class="alternative-link">
              <p><strong>Button not working?</strong> Copy and paste this link into your browser:</p>
              <div class="link-text">${magicLink}</div>
            </div>

            <!-- Security Notice -->
            <div class="security-notice">
              <h3>🔒 Security Information</h3>
              <ul>
                <li><strong>Valid for 15 minutes:</strong> This link will expire after 15 minutes</li>
                <li><strong>One-time use:</strong> The link can only be used once</li>
                <li><strong>Didn't request this?</strong> If you didn't ask to sign in, you can safely ignore this email</li>
                <li><strong>Never share this link:</strong> This is your personal login link</li>
              </ul>
            </div>

            <p class="message" style="margin-top: 30px;">
              Need help? Our support team is here for you at 
              <a href="mailto:${process.env.EMAIL_USER}" style="color: #2e7d32;">support@shambasecure.com</a>
            </p>
          </div>

          <!-- Footer -->
          <div class="email-footer">
            <p class="footer-text"><strong>ShambaSecure</strong></p>
            <p class="footer-text">Smart Farm Management System</p>
            
            <div class="footer-links">
              <a href="${process.env.FRONTEND_URL}" class="footer-link">Visit Website</a>
              <a href="${process.env.FRONTEND_URL}/help" class="footer-link">Help Center</a>
              <a href="${process.env.FRONTEND_URL}/contact" class="footer-link">Contact Us</a>
            </div>

            <p class="footer-text" style="margin-top: 20px; font-size: 12px; color: #999999;">
              This is an automated email from ShambaSecure. Please do not reply to this email.
            </p>
            
            <p class="footer-text" style="font-size: 12px; color: #999999;">
              &copy; ${new Date().getFullYear()} ShambaSecure. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    // Headers to improve deliverability
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high'
    }
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Magic link email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Send welcome email after registration
 */
export const sendWelcomeEmail = async (email, fullName) => {
  const firstName = fullName.split(' ')[0];
  
  const mailOptions = {
    from: {
      name: 'ShambaSecure Team',
      address: process.env.EMAIL_USER
    },
    to: email,
    subject: 'Welcome to ShambaSecure! 🌾',
    text: `
Hello ${firstName},

Welcome to ShambaSecure!

Thank you for joining our smart farm management platform. We're excited to help you manage your farm more efficiently!

What's next?
1. Sign in using the magic link we'll send to your email
2. Complete your farm profile
3. Start tracking your crops and activities
4. Explore our dashboard features

If you have any questions, our support team is here to help at ${process.env.EMAIL_USER}

Happy Farming!

Best regards,
The ShambaSecure Team

--
ShambaSecure - Smart Farm Management
    `.trim(),
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ShambaSecure</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f5f5f5;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
          }
          .email-header {
            background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
            padding: 50px 30px;
            text-align: center;
          }
          .logo {
            font-size: 36px;
            font-weight: bold;
            color: #ffffff;
            margin: 0 0 10px 0;
          }
          .welcome-message {
            font-size: 24px;
            color: #ffffff;
            margin: 0;
          }
          .email-body {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 24px;
            color: #2e7d32;
            margin: 0 0 20px 0;
            font-weight: 600;
          }
          .message {
            font-size: 16px;
            color: #555555;
            margin: 0 0 20px 0;
            line-height: 1.7;
          }
          .feature-box {
            background-color: #f9f9f9;
            border-left: 4px solid #4caf50;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .feature-box h3 {
            color: #2e7d32;
            margin: 0 0 15px 0;
            font-size: 18px;
          }
          .feature-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .feature-list li {
            padding: 10px 0;
            padding-left: 30px;
            position: relative;
            color: #555555;
          }
          .feature-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #4caf50;
            font-weight: bold;
            font-size: 18px;
          }
          .cta-button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
            margin: 20px 0;
          }
          .cta-container {
            text-align: center;
            margin: 30px 0;
          }
          .email-footer {
            background-color: #f9f9f9;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
          }
          .footer-text {
            font-size: 14px;
            color: #666666;
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <!-- Header -->
          <div class="email-header">
            <div class="logo">🌾 ShambaSecure</div>
            <div class="welcome-message">Welcome Aboard!</div>
          </div>

          <!-- Body -->
          <div class="email-body">
            <h1 class="greeting">Hello ${firstName}! 🎉</h1>
            
            <p class="message">
              Thank you for joining <strong>ShambaSecure</strong>! We're thrilled to have you as part of our farming community. Our platform is designed to help you manage your farm more efficiently and productively.
            </p>

            <!-- Features -->
            <div class="feature-box">
              <h3>🚀 What's Next?</h3>
              <ul class="feature-list">
                <li>Sign in using the magic link we'll send to your email</li>
                <li>Complete your farm profile with details about your crops</li>
                <li>Start tracking your farming activities and expenses</li>
                <li>Explore our smart analytics dashboard</li>
              </ul>
            </div>

            <div class="feature-box">
              <h3>✨ Key Features You'll Love</h3>
              <ul class="feature-list">
                <li>Real-time crop monitoring and management</li>
                <li>Financial tracking and reporting</li>
                <li>Weather forecasts and alerts</li>
                <li>Task scheduling and reminders</li>
                <li>Harvest predictions and analytics</li>
              </ul>
            </div>

            <!-- CTA -->
            <div class="cta-container">
              <a href="${process.env.FRONTEND_URL}/login" class="cta-button">
                Get Started Now
              </a>
            </div>

            <p class="message">
              If you have any questions or need assistance, don't hesitate to reach out to our support team at 
              <a href="mailto:${process.env.EMAIL_USER}" style="color: #2e7d32;">${process.env.EMAIL_USER}</a>
            </p>

            <p class="message" style="margin-top: 30px;">
              Happy Farming! 🚜<br>
              <strong>The ShambaSecure Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div class="email-footer">
            <p class="footer-text"><strong>ShambaSecure</strong></p>
            <p class="footer-text">Smart Farm Management System</p>
            <p class="footer-text" style="margin-top: 20px; font-size: 12px; color: #999999;">
              &copy; ${new Date().getFullYear()} ShambaSecure. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Welcome email failed:', error);
    return { success: false, error: error.message };
  }
};