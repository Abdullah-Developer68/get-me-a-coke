import dbConnect from "@/db/dbConnect";
import User from "@/models/User";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query || query.trim().length === 0) {
    return Response.json([]);
  }

  try {
    await dbConnect();
    console.log("🔍 API: Searching for query:", query);

    // Mongoose aggregate() method
    const results = await User.aggregate([
      // Stage 1: Atlas Search
      {
        $search: {
          index: "creator-index",
          autocomplete: {
            query: query,
            path: "username",
            fuzzy: {
              maxEdits: 1, // Allows 1 typo
              prefixLength: 2, // First 2 characters must match exactly
            },
            tokenOrder: "any",
          },
        },
      },
      // Stage 2: Limit results
      { $limit: 10 },
      // Stage 3: Project
      {
        $project: {
          _id: 0,
          username: 1,
          name: 1,
          profilePic: 1,
          score: { $meta: "searchScore" }, // Relevance score
        },
      },
    ]);

    console.log("✅ API: Found results:", results.length);
    console.log("📊 API: Results data:", JSON.stringify(results, null, 2));

    return Response.json(results);
  } catch (error) {
    console.error("Atlas Search Error:", error);
    return Response.json(
      { error: "Search failed", details: error.message },
      { status: 500 }
    );
  }
}
