import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import dbConnect from "@db/dbConnect";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // This is used when user is logging in using email and password
    CredentialsProvider({
      name: "Credentials",
      // This is the payload sent via the frontend
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (user.signMethod !== "local") {
          throw new Error("Please sign in with GitHub");
        }

        if (user.status !== "active") {
          throw new Error("Please complete OTP verification first");
        }

        // Hash and update the password (replacing the dummy one from OTP phase)
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        user.password = hashedPassword;
        // create username from email prefix
        const username = user.email.split("@")[0];
        user.username = username;
        await user.save();

        // Return user object (will be available in JWT and session)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          username: user.username, // Use actual username from database
          profilePic: user.profilePic,
          coverPic: user.coverPic,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      if (account.provider === "github") {
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
        return true;
      }

      if (account.provider === "credentials") {
        // Credentials provider - user is already validated in authorize()
        return true;
      }

      return false;
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
