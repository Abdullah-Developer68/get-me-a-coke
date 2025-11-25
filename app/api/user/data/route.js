import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/db/dbConnect";

export const GET = async (request) => {
  try {
    // Get username from query parameters
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user data directly (not wrapped in user object)
    return NextResponse.json(
      {
        // return only specific fields, with defaults for missing images
        coverPic: user.coverPic || "/coverImage.jpg",
        profilePic: user.profilePic || "/profilePic.png",
        name: user.name,
        username: user.username,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
