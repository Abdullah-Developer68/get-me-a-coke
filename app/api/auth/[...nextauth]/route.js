import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import User from "@/models/User";
import dbConnect from "@db/dbConnect";

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      if (account.provider == "github") {
        await dbConnect();
        // Check if the user already exists in the database
        const currentUser = await User.findOne({ email: user?.email });

        if (!currentUser) {
          // Create a new user
          const newUser = await User.create({
            email: user.email,
            // fallback to email prefix. Github profile name may not be unique
            username: user.email.split("@")[0],
            name: profile.name,
            signMethod: "github",
          });

          console.log("New User has been created as:" + newUser);
        }
        // if this is not written an error comes that you do not have permission by the app to sign in.
        return true;
      }
    },
    async session({ session }) {
      await dbConnect();
      const userExist = await User.findOne({ email: session.user.email });

      // Keep provider name intact; expose username as a separate field
      if (userExist?.username) session.user.username = userExist.username;
      // Map DB fields onto the session
      if (userExist?.profilePic) session.user.profilePic = userExist.profilePic;
      if (userExist?.coverPic) session.user.coverPic = userExist.coverPic;
      if (userExist?.name) session.user.name = userExist.name;

      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
