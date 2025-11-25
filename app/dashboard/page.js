"use client";

import { uploadUserInfoAction } from "@/actions/uploadUserInfoAction";
import useAuth from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { tellToFetchData } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session, update } = useSession();
  // Auth context
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
        setProfileRemoved(false); // Reset flag when new image is selected
        // store the unsaved changes
        setEdits((prev) => ({ ...prev, profilePic: reader.result }));
        localStorage.setItem(
          "edits",
          JSON.stringify({ ...edits, profilePic: reader.result })
        );
      } else if (e.target.id === "cover") {
        setCoverPreviewUrl(reader.result);
        setCoverRemoved(false); // Reset flag when new image is selected
        // store the unsaved changes
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
      setProfileRemoved(true); // Set flag when image is removed
      document.getElementById("profile").value = "";
      // update edits
      setEdits((prev) => ({ ...prev, profilePic: "/profilePic.png" }));

      localStorage.setItem(
        "edits",
        JSON.stringify({ ...edits, profilePic: "/profilePic.png" })
      );
    } else if (type === "cover") {
      setCoverPreviewUrl("/coverImage.png");
      setCoverRemoved(true); // Set flag when image is removed
      document.getElementById("cover").value = "";
      // update edits
      setEdits((prev) => ({ ...prev, coverPic: "/coverImage.png" }));
      localStorage.setItem(
        "edits",
        JSON.stringify({ ...edits, coverPic: "/coverImage.png" })
      );
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    // store the unsaved changes
    setEdits((prev) => ({ ...prev, name: e.target.value }));
    localStorage.setItem(
      "edits",
      JSON.stringify({ ...edits, name: e.target.value })
    );
  };

  // On refresh, the userInfo from context may take some time to load
  // So, we use useEffect to update the states when userInfo changes
  useEffect(() => {
    if (userInfo) {
      // set default edits if not already set
      if (edits === undefined) {
        const newEdits = {
          name: userInfo.name || "",
          profilePic: userInfo.profilePic || "",
          coverPic: userInfo.coverPic || "",
        };
        setEdits(newEdits);
        localStorage.setItem("edits", JSON.stringify(newEdits));
      }
      // Form Fields -> last edits > userInfo > placeholders
      setName(edits?.name || userInfo.name || "Enter your name");
      setProfilePreviewUrl(
        edits?.profilePic || userInfo.profilePic || "/profilePic.png"
      );
      setCoverPreviewUrl(
        edits?.coverPic || userInfo.coverPic || "/coverImage.png"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]); // Run when userInfo changes

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Debug: Log FormData entries
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const res = await uploadUserInfoAction(formData);
    if (!res.ok) {
      alert("Error updating profile: " + res.error);
      return;
    }

    dispatch(tellToFetchData(true)); // Tells the user's page to fetch updated data
    // Update userInfo with the latest changes and the previous values are set as fallbacks
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        ...userInfo,
        name: name || userInfo.name,
        profilePic: res.profilePic || userInfo.profilePic,
        coverPic: res.coverPic || userInfo.coverPic,
      })
    );

    // update method updates the token so we need to handle these changes in the jwt callback and session will get the changes from the token
    // IMPORTANT: Only pass the actual URLs from the server response, NOT data URLs (which are huge) they will exceed the maximum header size
    // allowed by the browser and the request will fail and the session will not be updated
    try {
      await update({
        name: name || userInfo.name,
        profilePic: res.profilePic || userInfo.profilePic,
        coverPic: res.coverPic || userInfo.coverPic,
      });
      console.log("Session updated successfully");
    } catch (error) {
      console.error("Failed to update session:", error);
    }

    // Small delay to ensure localStorage is written before redirect
    setTimeout(() => {
      router.push(`/${userInfo.username}`);
    }, 100);
  };

  return (
    <>
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
                <p className="text-gray-400 text-lg">
                  Customize your profile and make it yours
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {/* Main Form Card */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
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

                    {/* Profile Information Section */}
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold text-white mb-6">
                        Profile Information
                      </h2>

                      {/* Name Input */}
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-gray-300"
                        >
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          placeholder={name}
                          className="w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                          onChange={handleNameChange}
                        />
                      </div>

                      {/* Profile Picture Section */}
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-300">
                          Profile Picture
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            id="profile"
                            name="profile"
                            type="file"
                            accept="image/*"
                            className="w-full rounded-md border border-gray-700 bg-gray-800/50 text-white file:mr-3 file:rounded file:border-0 file:bg-gray-500 file:px-3 file:py-1 file:text-white hover:file:bg-black hover:cursor-pointer hover:file:cursor-pointer transition-colors"
                            onChange={filePreview}
                          />
                          {profilePreviewUrl &&
                            profilePreviewUrl !== "/profilePic.png" &&
                            profilePreviewUrl !== "" && (
                              <button
                                type="button"
                                onClick={() => removeFile("profile")}
                                className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                              >
                                Remove
                              </button>
                            )}
                        </div>
                        {/* Profile Preview (circular) */}
                        <div className="mt-2">
                          <div className="h-28 w-28 rounded-full overflow-hidden border border-gray-800 bg-gray-800/30 flex items-center justify-center relative">
                            {profilePreviewUrl ? (
                              <Image
                                src={profilePreviewUrl}
                                alt="Profile preview"
                                fill
                                className="object-cover rounded-full"
                              />
                            ) : (
                              <span className="text-gray-500 text-xs px-2 text-center">
                                No profile image selected
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Cover Picture Section */}
                      <div className="space-y-4">
                        <label className="text-sm font-medium text-gray-300">
                          Cover Picture
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            id="cover"
                            name="cover"
                            type="file"
                            accept="image/*"
                            className="w-full rounded-md border border-gray-700 bg-gray-800/50 text-white file:mr-3 file:rounded file:border-0 file:bg-gray-500 file:px-3 file:py-1 file:text-white hover:file:bg-black hover:cursor-pointer hover:file:cursor-pointer transition-colors"
                            onChange={filePreview}
                          />
                          {coverPreviewUrl &&
                            coverPreviewUrl !== "/coverImage.png" &&
                            coverPreviewUrl !== "" && (
                              <button
                                type="button"
                                onClick={() => removeFile("cover")}
                                className="px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                              >
                                Remove
                              </button>
                            )}
                        </div>
                        {/* Cover Preview */}
                        <div className="mt-2 w-full h-40 rounded-md border border-gray-800 bg-gray-800/30 flex items-center justify-center overflow-hidden relative">
                          {coverPreviewUrl ? (
                            <Image
                              src={coverPreviewUrl}
                              alt="Cover preview"
                              fill
                              className="object-cover rounded-md"
                            />
                          ) : (
                            <span className="text-gray-500 text-xs">
                              No cover image selected
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col items-center gap-4">
                      <button
                        type="submit"
                        className="rounded-md bg-white px-8 py-3 text-lg font-semibold text-black cursor-pointer"
                      >
                        Update Profile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
}
