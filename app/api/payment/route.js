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
    console.log("getting payments");
    // Get the 10 most recent payments using .lean() for faster queries as it avoids creating mongoose documents
    const recentPayments = await Payment.find({ to_user: username })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json(recentPayments);
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
