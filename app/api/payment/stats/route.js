import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect";
import Payment from "@/models/Payment";

// GET /api/payment/stats?username=<creator>&top=50
export async function GET(request) {
  await dbConnect();

  const url = request?.nextUrl || new URL(request.url);
  const username = url.searchParams.get("username");
  const topParam = parseInt(url.searchParams.get("top") || "100", 10);
  const limit = Math.min(Math.max(topParam || 100, 1), 200);

  if (!username) {
    return NextResponse.json(
      { error: "username is required" },
      { status: 400 }
    );
  }

  try {
    // Summary stats
    const [summary] = await Payment.aggregate([
      { $match: { to_user: username } },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
          lastPaymentAt: { $max: "$createdAt" },
          supportersSet: { $addToSet: "$name" },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          count: 1,
          lastPaymentAt: 1,
          uniqueSupporters: { $size: "$supportersSet" },
          averageAmount: {
            $cond: [
              { $gt: ["$count", 0] },
              { $divide: ["$totalAmount", "$count"] },
              0,
            ],
          },
        },
      },
    ]);

    // Top supporters by total donated amount (scrollable leaderboard)
    const topSupporters = await Payment.aggregate([
      { $match: { to_user: username } },
      {
        $group: {
          _id: "$name",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
          lastPaymentAt: { $max: "$createdAt" },
        },
      },
      { $sort: { totalAmount: -1, count: -1, lastPaymentAt: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          name: "$_id",
          totalAmount: 1,
          count: 1,
          lastPaymentAt: 1,
        },
      },
    ]);

    return NextResponse.json({
      username,
      totalAmount: summary?.totalAmount || 0,
      count: summary?.count || 0,
      lastPaymentAt: summary?.lastPaymentAt || null,
      uniqueSupporters: summary?.uniqueSupporters || 0,
      averageAmount: summary?.averageAmount || 0,
      topSupporters,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
