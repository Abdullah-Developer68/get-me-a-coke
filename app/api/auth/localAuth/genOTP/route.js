import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import User from "@/models/User";
import dbConnect from "@/db/dbConnect";
export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { name, receiverEmail } = await request.json();
    await dbConnect();

    // create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit OTP as string

    const userExist = await User.findOne({ email: receiverEmail });

    if (userExist) {
      // If user account is active return
      if (userExist.status !== "verifying") {
        return NextResponse.json({ message: "Your account already exists" });
      } else {
        // else update the otp
        userExist.otp = otp;
        await userExist.save();
        return NextResponse.json({ message: "OTP has been resent" });
      }
    }

    // create a user under the status of verifying
    await User.create({
      name: name || "pending",
      username: "pending",
      email: receiverEmail,
      otp, // Store OTP in the user document
      status: "verifying",
      // Required by User schema (enum: ["github", "local"]) so local pre-signup validates
      signMethod: "local",
      password: "temp_pending_password", // Placeholder - will be replaced during verification
    });

    // Configure Email Data
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: receiverEmail, // The recipient of the email
      subject: `OTP signup:`,
      text: `
        Name: ${name}
        Email: ${receiverEmail}
        Message: Use this OTP to SignUp ${otp}
      `,
    };

    // send email
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to send email." },
      { status: 500 }
    );
  }
}
