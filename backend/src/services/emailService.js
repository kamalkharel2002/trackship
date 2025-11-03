import nodemailer from 'nodemailer';
import config from '../config/index.js';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

export const emailService = {
  async sendOTP(email, otp) {
    const mailOptions = {
      from: config.smtp.from,
      to: email,
      subject: 'TrackShip - Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>TrackShip OTP Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="color: #0066cc; font-size: 32px; letter-spacing: 4px;">${otp}</h1>
          <p>This code will expire in ${config.otp.expiryMinutes} minutes.</p>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },
};

