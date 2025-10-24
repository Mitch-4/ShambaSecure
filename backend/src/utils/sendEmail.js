import nodemailer from "nodemailer";

export const sendMagicLinkEmail = async (email, link) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ShambaSecure" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your ShambaSecure Magic Login Link",
      html: `
        <div style="font-family:Arial, sans-serif;">
          <h2>Welcome back to ShambaSecure 👩🏾‍🌾</h2>
          <p>Click the button below to log in securely:</p>
          <a href="${link}" 
             style="background:#2e7d32;color:white;padding:10px 20px;
             text-decoration:none;border-radius:6px;">
             Login to ShambaSecure
          </a>
          <p>This link will expire soon. If you didn’t request it, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Magic link sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending magic link email:", error);
  }
};
