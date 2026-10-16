import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import User from "@/models/User";
import dbConnect from "@/db/dbConnect";
export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { name, receiverEmail } = await request.json();
    const email = receiverEmail?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Missing EMAIL_USER or EMAIL_PASS environment variables.");
      return NextResponse.json(
        {
          message:
            "Email service is not configured on the server (missing EMAIL_USER or EMAIL_PASS).",
        },
        { status: 500 }
      );
    }

    await dbConnect();

    // Generate 6-digit OTP as string
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const displayName = name?.trim() || email.split("@")[0];

    const userExist = await User.findOne({ email });
    let isResend = false;

    if (userExist) {
      // If user account is already active, return 409 Conflict instead of 200 OK
      if (userExist.status !== "verifying") {
        return NextResponse.json(
          { message: "Your account already exists. Please sign in instead." },
          { status: 409 }
        );
      }

      // User is in "verifying" status: update OTP and continue to send the email
      userExist.otp = otp;
      if (userExist.username === "pending") {
        userExist.username = undefined;
      }
      await userExist.save();
      isResend = true;
    } else {
      // Clear any legacy unverified documents that had hardcoded username: "pending"
      await User.updateMany(
        { username: "pending", status: "verifying" },
        { $unset: { username: 1 } }
      );

      // Create a user under the status of verifying (omit username so sparse unique index doesn't collide)
      await User.create({
        name: displayName,
        email,
        otp,
        status: "verifying",
        signMethod: "local",
        password: "temp_pending_password",
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Configure Email Data
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code - Get Me A Coke",
      text: `Hello ${displayName},\n\nYour 6-digit verification code for Get Me A Coke is: ${otp}\n\nEnter this code on the sign-up page to verify your email address.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message: isResend
          ? "OTP has been resent to your email!"
          : "Email sent successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to send email. Please try again." },
      { status: 500 }
    );
  }
}
