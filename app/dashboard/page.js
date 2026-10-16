"use client";

import { uploadUserInfoAction } from "@/actions/uploadUserInfoAction";
import useAuth from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tellToFetchData } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "sonner";
import {
  Camera,
  ImagePlus,
  Trash2,
  User,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Save,
  Loader2,
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { update } = useSession();
  const { userInfo, isLoading } = useAuth();

  // to track unsaved changes
  const [edits, setEdits] = useState(
    typeof window !== "undefined" && localStorage.getItem("edits")
      ? JSON.parse(localStorage.getItem("edits"))
      : undefined
  );

  // states for form fields and previews
  const [name, setName] = useState("");
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");
  const [tagline, setTagline] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Flags to track if images were explicitly removed
  const [profileRemoved, setProfileRemoved] = useState(false);
  const [coverRemoved, setCoverRemoved] = useState(false);

  // Files preview handler
  const filePreview = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (e.target.id === "profile") {
        setProfilePreviewUrl(reader.result);
        setProfileRemoved(false);
        setEdits((prev) => ({ ...prev, profilePic: reader.result }));
        localStorage.setItem(
          "edits",
          JSON.stringify({ ...edits, profilePic: reader.result })
        );
      } else if (e.target.id === "cover") {
        setCoverPreviewUrl(reader.result);
        setCoverRemoved(false);
        setEdits((prev) => ({ ...prev, coverPic: reader.result }));
        localStorage.setItem(
          "edits",
          JSON.stringify({ ...edits, coverPic: reader.result })
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (type) => {
    if (type === "profile") {
      setProfilePreviewUrl("/profilePic.png");
      setProfileRemoved(true);
      const inputEl = document.getElementById("profile");
      if (inputEl) inputEl.value = "";
      setEdits((prev) => ({ ...prev, profilePic: "/profilePic.png" }));
      localStorage.setItem(
        "edits",
        JSON.stringify({ ...edits, profilePic: "/profilePic.png" })
      );
    } else if (type === "cover") {
      setCoverPreviewUrl("/coverImage.jpg");
      setCoverRemoved(true);
      const inputEl = document.getElementById("cover");
      if (inputEl) inputEl.value = "";
      setEdits((prev) => ({ ...prev, coverPic: "/coverImage.jpg" }));
      localStorage.setItem(
        "edits",
        JSON.stringify({ ...edits, coverPic: "/coverImage.jpg" })
      );
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setEdits((prev) => ({ ...prev, name: e.target.value }));
    localStorage.setItem(
      "edits",
      JSON.stringify({ ...edits, name: e.target.value })
    );
  };

  const handleTaglineChange = (e) => {
    setTagline(e.target.value);
    setEdits((prev) => ({ ...prev, tagline: e.target.value }));
    localStorage.setItem(
      "edits",
      JSON.stringify({ ...edits, tagline: e.target.value })
    );
  };

  useEffect(() => {
    if (userInfo) {
      if (edits === undefined) {
        const newEdits = {
          name: userInfo.name || "",
          profilePic: userInfo.profilePic || "",
          coverPic: userInfo.coverPic || "",
        };
        setEdits(newEdits);
        localStorage.setItem("edits", JSON.stringify(newEdits));
      }
      setName(edits?.name || userInfo.name || "Enter your name");
      setProfilePreviewUrl(
        edits?.profilePic || userInfo.profilePic || "/profilePic.png"
      );
      setCoverPreviewUrl(
        edits?.coverPic || userInfo.coverPic || "/coverImage.jpg"
      );
      setTagline(edits?.tagline || userInfo.tagline || "Enter your tagline");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-3 text-white">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        <p className="text-zinc-400 text-sm">Loading your studio...</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    toast("Updating profile...");
    const formData = new FormData(e.target);

    try {
      const res = await uploadUserInfoAction(formData);
      if (!res.ok) {
        toast.error("Error updating profile: " + res.error);
        setIsSaving(false);
        return;
      }

      dispatch(tellToFetchData(true));
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          ...userInfo,
          name: name || userInfo.name,
          profilePic: res.profilePic || userInfo.profilePic,
          coverPic: res.coverPic || userInfo.coverPic,
          tagline: res.tagline || userInfo.tagline,
        })
      );

      try {
        await update({
          name: name || userInfo.name,
          profilePic: res.profilePic || userInfo.profilePic,
          coverPic: res.coverPic || userInfo.coverPic,
          tagline: res.tagline || userInfo.tagline,
        });
      } catch (error) {
        console.error("Failed to update session:", error);
      }

      toast.success("Profile updated successfully");
      setTimeout(() => {
        router.push(`/${userInfo.username}`);
      }, 100);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/25 px-3 py-1 text-xs font-semibold text-red-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Creator Studio
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Customize Your Page
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base mt-1">
              Personalize your branding, cover banner, and creator tagline.
            </p>
          </div>

          {userInfo?.username && (
            <Link
              href={`/${userInfo.username}`}
              className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/15 px-4 py-2.5 text-xs sm:text-sm font-medium text-zinc-200 transition-colors shrink-0"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-4 h-4 text-zinc-400" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left / Top: Live Interactive Preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="rounded-3xl bg-zinc-900 border border-white/15 overflow-hidden shadow-2xl">
              <div className="px-4 sm:px-5 py-3.5 border-b border-white/10 flex items-center justify-between gap-2 bg-zinc-950">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2 shrink-0">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Page Preview
                </span>
                <span className="text-xs text-zinc-500 font-mono truncate">
                  /{userInfo?.username || "creator"}
                </span>
              </div>

              {/* Cover Preview */}
              <div className="relative h-32 sm:h-40 w-full bg-zinc-800 overflow-hidden border-b border-white/10">
                {coverPreviewUrl ? (
                  <Image
                    src={coverPreviewUrl}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800" />
                )}
              </div>

              {/* Avatar & Identity Preview */}
              <div className="px-4 sm:px-6 pb-6 sm:pb-7 -mt-12 relative flex flex-col items-center text-center">
                <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-zinc-900 bg-zinc-800 shadow-xl shrink-0">
                  {profilePreviewUrl ? (
                    <Image
                      src={profilePreviewUrl}
                      alt="Profile preview"
                      fill
                      className="object-cover rounded-full"
                      unoptimized
                    />
                  ) : (
                    <span className="text-zinc-500 text-xs flex items-center justify-center h-full">
                      No image
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-base sm:text-lg font-bold text-white flex items-center justify-center gap-1.5 max-w-full">
                  <span className="truncate">
                    {name && name !== "Enter your name"
                      ? name
                      : userInfo?.username || "Creator Name"}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                </h3>
                <p className="text-xs font-medium text-zinc-400 truncate max-w-full">
                  @{userInfo?.username || "username"}
                </p>
                <p className="mt-2 text-xs sm:text-sm text-zinc-300 line-clamp-2 max-w-xs break-words">
                  {tagline && tagline !== "Enter your tagline"
                    ? tagline
                    : "Check out my content!"}
                </p>

                <div className="mt-5 w-full pt-4 border-t border-white/10 flex items-center justify-around text-xs text-zinc-400">
                  <div className="flex flex-col items-center">
                    <p className="font-bold text-white text-xs sm:text-sm flex items-center gap-1">
                      <Image
                        src="/logo.jpg"
                        alt="Coke"
                        width={16}
                        height={16}
                        className="rounded-full object-cover shrink-0"
                      />
                      $10
                    </p>
                    <p className="text-[11px] sm:text-xs">1 Coke</p>
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <div className="flex flex-col items-center">
                    <p className="font-bold text-white text-xs sm:text-sm flex items-center gap-1">
                      <Image
                        src="/logo.jpg"
                        alt="Coke"
                        width={16}
                        height={16}
                        className="rounded-full object-cover shrink-0"
                      />
                      $50
                    </p>
                    <p className="text-[11px] sm:text-xs">5 Cokes</p>
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <div className="flex flex-col items-center">
                    <p className="font-bold text-white text-xs sm:text-sm flex items-center gap-1">
                      <Image
                        src="/logo.jpg"
                        alt="Coke"
                        width={16}
                        height={16}
                        className="rounded-full object-cover shrink-0"
                      />
                      $100
                    </p>
                    <p className="text-[11px] sm:text-xs">10 Cokes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Main Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-zinc-900 border border-white/15 p-5 sm:p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
                {/* Hidden inputs to send removal flags */}
                <input
                  type="hidden"
                  name="profileRemoved"
                  value={profileRemoved.toString()}
                />
                <input
                  type="hidden"
                  name="coverRemoved"
                  value={coverRemoved.toString()}
                />

                <div className="border-b border-white/10 pb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-red-500 shrink-0" />
                    Profile Information
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Changes are previewed live and saved to your public creator
                    profile.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block"
                    >
                      Display Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder={name}
                      className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                      onChange={handleNameChange}
                    />
                  </div>

                  {/* Tagline Input */}
                  <div className="space-y-2">
                    <label
                      htmlFor="tagline"
                      className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block"
                    >
                      Creator Tagline / Bio
                    </label>
                    <input
                      id="tagline"
                      name="tagline"
                      type="text"
                      placeholder={tagline}
                      className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition-all"
                      onChange={handleTaglineChange}
                    />
                  </div>

                  {/* Profile Picture Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <label
                        htmlFor="profile"
                        className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5"
                      >
                        <Camera className="w-4 h-4 text-red-400 shrink-0" />
                        Profile Avatar
                      </label>
                      {profilePreviewUrl &&
                        profilePreviewUrl !== "/profilePic.png" &&
                        profilePreviewUrl !== "" && (
                          <button
                            type="button"
                            onClick={() => removeFile("profile")}
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Reset to default
                          </button>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl bg-zinc-950 border border-white/10 p-4">
                      <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-white/15 bg-zinc-900 shrink-0 relative">
                        {profilePreviewUrl ? (
                          <Image
                            src={profilePreviewUrl}
                            alt="Profile preview"
                            fill
                            className="object-cover rounded-full"
                            unoptimized
                          />
                        ) : (
                          <span className="text-zinc-500 text-xs flex items-center justify-center h-full text-center px-2">
                            No image
                          </span>
                        )}
                      </div>
                      <div className="flex-1 w-full min-w-0 overflow-hidden">
                        <input
                          id="profile"
                          name="profile"
                          type="file"
                          accept="image/*"
                          className="w-full max-w-full text-xs sm:text-sm text-zinc-400 file:mr-3 sm:file:mr-4 file:rounded-xl file:border-0 file:bg-zinc-800 file:px-3.5 sm:file:px-4 file:py-2 sm:file:py-2.5 file:text-xs file:font-semibold file:text-white hover:file:bg-red-600 file:transition-colors hover:cursor-pointer file:cursor-pointer"
                          onChange={filePreview}
                        />
                        <p className="text-[11px] text-zinc-500 mt-2">
                          Recommended: Square JPG, PNG, or GIF (at least
                          400×400px).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cover Picture Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <label
                        htmlFor="cover"
                        className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5"
                      >
                        <ImagePlus className="w-4 h-4 text-red-400 shrink-0" />
                        Cover Banner
                      </label>
                      {coverPreviewUrl &&
                        coverPreviewUrl !== "/coverImage.jpg" &&
                        coverPreviewUrl !== "" && (
                          <button
                            type="button"
                            onClick={() => removeFile("cover")}
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Reset to default
                          </button>
                        )}
                    </div>

                    <div className="rounded-2xl bg-zinc-950 border border-white/10 p-4 space-y-3 overflow-hidden">
                      <div className="w-full h-32 sm:h-36 rounded-xl border border-white/10 bg-zinc-900 flex items-center justify-center overflow-hidden relative">
                        {coverPreviewUrl ? (
                          <Image
                            src={coverPreviewUrl}
                            alt="Cover preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="text-zinc-500 text-xs">
                            No cover image selected
                          </span>
                        )}
                      </div>
                      <input
                        id="cover"
                        name="cover"
                        type="file"
                        accept="image/*"
                        className="w-full max-w-full text-xs sm:text-sm text-zinc-400 file:mr-3 sm:file:mr-4 file:rounded-xl file:border-0 file:bg-zinc-800 file:px-3.5 sm:file:px-4 file:py-2 sm:file:py-2.5 file:text-xs file:font-semibold file:text-white hover:file:bg-red-600 file:transition-colors hover:cursor-pointer file:cursor-pointer"
                        onChange={filePreview}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-red-600 hover:bg-red-500 px-8 py-3.5 text-sm font-bold text-white transition-colors cursor-pointer disabled:opacity-60"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Update Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
