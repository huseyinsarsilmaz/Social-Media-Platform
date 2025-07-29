import {
  followUser,
  unfollowUser,
  updateProfile,
  uploadImage,
} from "../profileActions";

import { UserSimple } from "@/interface/interfaces";

export function handleFormChange(
  e: React.ChangeEvent<HTMLInputElement>,
  setForm: React.Dispatch<React.SetStateAction<any>>
) {
  setForm((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
}

export async function handleProfileSave(
  token: string | null,
  form: any,
  setSaving: React.Dispatch<React.SetStateAction<boolean>>,
  setSaveError: React.Dispatch<React.SetStateAction<string | null>>,
  setUser: React.Dispatch<React.SetStateAction<UserSimple | null>>,
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
) {
  if (!token) return;
  setSaving(true);
  setSaveError(null);
  try {
    const res = await updateProfile(token, form);
    if (res.data.status) {
      setUser(res.data.data);
      setIsEditing(false);
    } else {
      setSaveError(res.data.message || "Update failed");
    }
  } catch (err: any) {
    setSaveError(err?.response?.data?.message || "Update failed");
  } finally {
    setSaving(false);
  }
}

export async function handleImageUpload(
  token: string | null,
  file: File,
  type: "profile" | "cover",
  setUploading: React.Dispatch<
    React.SetStateAction<{ profile: boolean; cover: boolean }>
  >,
  setUser: React.Dispatch<React.SetStateAction<UserSimple | null>>
) {
  if (!token) return;
  const formData = new FormData();
  formData.append(type === "profile" ? "profilePicture" : "coverPicture", file);
  setUploading((prev) => ({ ...prev, [type]: true }));
  try {
    const res = await uploadImage(token, formData, type);
    if (res.data.status) {
      setUser(res.data.data);
    } else {
      alert(res.data.message || "Upload failed");
    }
  } catch (err: any) {
    alert(err?.response?.data?.message || "Upload failed");
  } finally {
    setUploading((prev) => ({ ...prev, [type]: false }));
  }
}

export const handleFollowButtonClick = async (
  isFollowing: boolean,
  token: string,
  userId: number,
  setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>,
  reload: () => Promise<void>
) => {
  try {
    if (isFollowing) {
      await unfollowUser(token, userId);
      setIsFollowing(false);
      await reload();
    } else {
      await followUser(token, userId);
      setIsFollowing(true);
      await reload();
    }
  } catch (err) {
    console.error("Failed to toggle follow:", err);
  }
};
