import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import dbConnect from "@/db/dbConnect";
import bcrypt from "bcryptjs";

export const authOptions = {
  // session is the object that hold the data of the current login
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
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
    // when useSession() is called in frontend, this session callback runs
    async session({ session, token }) {
      // No DB call - just read from JWT token (much faster!)
      if (session?.user) {
        session.user.username = token.username;
        session.user.profilePic = token.profilePic;
        session.user.coverPic = token.coverPic;
        session.user.name = token.name;
      }
      return session;
    },
    // After successful sign in, redirect user to home page
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, user, account, trigger, session }) {
      // This runs when user first signs in (user object is available)
      if (user) {
        // For GitHub sign-in, fetch user data from DB
        if (account?.provider === "github") {
          await dbConnect();
          const dbUser = await User.findOne({ email: user.email });
          token.sub = dbUser?._id.toString(); // Store user ID. This allows next auth to use the update function to update the token later
          token.username = dbUser?.username || user.email.split("@")[0];
          token.profilePic = dbUser?.profilePic;
          token.coverPic = dbUser?.coverPic;
          token.name = dbUser?.name || user.name;
        }
        // For credentials sign-in, user object already has all data
        else {
          token.sub = user.id; // Store user ID
          token.username = user.username;
          token.profilePic = user.profilePic;
          token.coverPic = user.coverPic;
          token.name = user.name;
        }
      }

      // This part runs on update() calls, the updated values come through the session
      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.profilePic = session.profilePic || token.profilePic;
        token.coverPic = session.coverPic || token.coverPic;
      }

      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
