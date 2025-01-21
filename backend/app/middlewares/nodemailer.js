import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import { User } from '../models/userModel.js';

// setup for nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'kruthikgowda634@gmail.com',
    pass: 'jbtktlgcqxfewfgg',
  },
});

// sending otp functionality
const sendOtp = async (id, email) => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const otpExpires = new Date(Date.now() + 15 * 60 * 1000);
  try {
    const salt = await bcryptjs.genSalt();
    const hashOtp = await bcryptjs.hash(otp, salt);
    await User.findByIdAndUpdate(id, { otp: hashOtp, otpExpires });

    await transporter.sendMail({
      // eslint-disable-next-line no-undef
      from: process.env.HOST_EMAIL,
      to: email,
      subject: 'Verify your OTP',
      html: `<p>enter this otp <b>${otp}</b> to verify your email id... otp expires in <b>15 minutes..</b></p>`,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default sendOtp;
