import dbConnect from "@/db/dbConnect";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    // Fetch specific popular creators by their usernames
    const popularUsernames = ["mrbeast", "chai-aur-code", "code-with-harry"];

    const popularCreators = await User.find({
      username: { $in: popularUsernames },
    })
      .select("username name profilePic -_id")
      .lean();

    console.log("Popular creators:", popularCreators);

    return Response.json(popularCreators);
  } catch (error) {
    console.error("Error fetching popular creators:", error);
    return Response.json(
      { error: "Failed to fetch popular creators" },
      { status: 500 }
    );
  }
}
