import nodemailer from 'nodemailer';

export const sendMagicLinkEmail = async (email, magicLink) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // match your .env
      }
    });

    const mailOptions = {
      from: `"ShambaSecure" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🔐 Your ShambaSecure Magic Link',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center;">
          <h2>🌿 Welcome to ShambaSecure</h2>
          <p>Click the button below to securely log in:</p>
          <a href="${magicLink}" 
            style="background-color:#16a34a; color:white; padding:12px 20px; border-radius:6px; text-decoration:none; display:inline-block;">
            Login to ShambaSecure
          </a>
          <p style="margin-top:20px;">Or copy this link into your browser:</p>
          <p style="word-break:break-all;">${magicLink}</p>
          <p style="font-size:12px; color:#777;">If you didn’t request this, please ignore this email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Magic link sent to ${email} (${info.messageId})`);
    return info;
  } catch (error) {
    console.error('❌ Error sending magic link email:', error);
    throw error;
  }
};
