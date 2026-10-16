import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import Payment from "@/models/Payment";

// req for getting recent payments
export async function GET(request) {
  await dbConnect();
  // read username from query params (GET should not have a body)
  const username =
    (request?.nextUrl && request.nextUrl.searchParams.get("username")) ||
    new URL(request.url).searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "username is required" },
      { status: 400 }
    );
  }

  try {
    // Get up to 100 recent payments using .lean() for faster queries
    const recentPayments = await Payment.find({ to_user: username })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json(recentPayments);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
