import * as nodemailer from 'nodemailer';

export const sendOtp = async (email: string, generateOtp: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'bansalakshit0460@gmail.com',
      pass: process.env.SMTP_PASS || 'hidn dkcr eytc szap',
    },
  });
  await transporter.sendMail({
    from: 'bansalakshit0460@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${generateOtp}. It is valid for 10 minutes.`,
  });
};
