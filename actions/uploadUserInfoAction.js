"use server";

import cloudinary from "@/lib/cloudinary";
import User from "@/models/User.js";
import dbConnect from "@/db/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function uploadToCloudinary(file, folder) {
  // Skip if no file or it isn't a File (can be null when user didn't select)
  if (!file || typeof file.arrayBuffer !== "function") return null;
  // Only allow images
  if (file.type && !file.type.startsWith("image/")) return null;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

export async function uploadUserInfoAction(formData) {
  try {
    console.log("Uploading user info...");
    console.log(formData);
    // Ensure DB connection
    await dbConnect();

    // Authenticated user
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.toString() || null;

    // Optional text fields from the form
    const name = formData.get("name")?.toString() || null;

    // Files
    const profileFile = formData.get("profile");
    const coverFile = formData.get("cover");

    // Flags from the form to signal explicit removal of images
    const profileRemoved = formData.get("profileRemoved") === "true";
    const coverRemoved = formData.get("coverRemoved") === "true";

    if (!email) {
      return { ok: false, error: "Not authenticated" };
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return { ok: false, error: "User does not exist" };
    }

    const DEFAULTS = {
      profilePic: "/profilePic.png",
      coverPic: "/coverImage.png",
    };

    // Upload in parallel (if provided). If user explicitly removed, do not upload; just set default
    const [profileUpload, coverUpload] = await Promise.all([
      profileRemoved
        ? null
        : uploadToCloudinary(profileFile, "get-me-a-coke/profile"),
      coverRemoved
        ? null
        : uploadToCloudinary(coverFile, "get-me-a-coke/cover"),
    ]);

    // Build update object with only provided values
    const update = {};
    if (name) update.name = name;

    if (profileUpload?.secure_url) {
      update.profilePic = profileUpload.secure_url; // schema fields: profilePic
    } else if (profileRemoved) {
      update.profilePic = DEFAULTS.profilePic;
    }

    if (coverUpload?.secure_url) {
      update.coverPic = coverUpload.secure_url; // schema fields: coverPic
    } else if (coverRemoved) {
      update.coverPic = DEFAULTS.coverPic;
    }

    // If nothing to update, return current user (as plain object)
    if (Object.keys(update).length === 0) {
      const safe = userExists.toObject ? userExists.toObject() : userExists;
      const {
        _id,
        name: n,
        email: e,
        profilePic,
        coverPic,
        username,
      } = safe || {};

      return {
        ok: true,
        profilePic,
        coverPic,
        name: n,
        user: {
          _id: String(_id),
          name: n,
          email: e,
          profilePic,
          coverPic,
          username,
        },
      };
    }

    // Persist and return the updated user document (as plain object)
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: update },
      { new: true, runValidators: true }
    );

    const safeUpdated = updatedUser?.toObject
      ? updatedUser.toObject()
      : updatedUser;
    const {
      _id,
      name: n,
      email: e,
      profilePic,
      coverPic,
      username,
    } = safeUpdated || {};
    console.log("User info updated:", { email: e });
    return {
      ok: true,
      profilePic,
      coverPic,
      name: n,
      user: {
        _id: String(_id),
        name: n,
        email: e,
        profilePic,
        coverPic,
        username,
      },
    };
  } catch (err) {
    console.error("uploadUserInfoAction error:", err);
    return { ok: false, error: err?.message || "Unknown error" };
  }
}
