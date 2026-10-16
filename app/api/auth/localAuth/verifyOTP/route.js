import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/db/dbConnect";
export const runtime = "nodejs";

// This is for verifying the OTP and after this the user can login
export async function POST(request) {
  try {
    const { email: rawEmail, otp } = await request.json();
    const email = rawEmail?.trim().toLowerCase();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Please provide a valid email." },
        { status: 404 }
      );
    }

    if (!user.otp || String(otp).trim() !== String(user.otp).trim()) {
      return NextResponse.json(
        { message: "Invalid OTP. Please check the code and try again." },
        { status: 400 }
      );
    }

    user.status = "active";
    user.otp = undefined;
    if (user.username === "pending") {
      user.username = undefined;
    }
    await user.save();

    return NextResponse.json(
      { message: "OTP verified successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "Failed to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}
