import nodemailer from 'nodemailer';
// Ensure 'process' is accessible by importing 'dotenv' and configuring it
import dotenv from 'dotenv';

dotenv.config();

export const sendApprovalEmail = async (buyerEmail, bookName) => {
  // Check if environment variables are loaded correctly
  if (!process.env.EMAIL_USR || !process.env.APP_PASS) {
    console.error('Email credentials are missing in environment variables');
    throw new Error('Email configuration error: Missing credentials');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USR,
      pass: process.env.APP_PASS,
    },
    debug: true, // Add this for debugging purposes
  });

  const mailOptions = {
    from: process.env.EMAIL_USR,
    to: Array.isArray(buyerEmail) ? buyerEmail : [buyerEmail],
    subject: `Your request for ${bookName} has been approved!`,
    text: `Dear Buyer and Seller, your rental request for Book:- ${bookName} has been approved. Please proceed with the next steps.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};