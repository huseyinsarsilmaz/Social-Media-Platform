import {
  updateProfile,
  uploadImage,
} from "../profileActions";

import {
  deletePost,
  updatePost,
} from "../../components/commonActions";

import { UserSimple, PostWithUser } from "@/interface/interfaces";

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

export async function handleDeletePost(
  token: string | null,
  id: number,
  reloadPosts: () => Promise<void>
) {
  if (!token || !confirm("Delete this post?")) return;
  try {
    await deletePost(token, id);
    await reloadPosts();
  } catch (err: any) {
    alert(err?.response?.data?.message || "Failed to delete post");
  }
}

export async function handleEditPost(
  token: string | null,
  editPostId: number | null,
  editText: string,
  setEditingPost: React.Dispatch<React.SetStateAction<boolean>>,
  setEditError: React.Dispatch<React.SetStateAction<string | null>>,
  setEditPostId: React.Dispatch<React.SetStateAction<number | null>>,
  setEditText: React.Dispatch<React.SetStateAction<string>>,
  reloadPosts: () => Promise<void>
) {
  if (!token || !editPostId) return;
  setEditingPost(true);
  setEditError(null);
  try {
    await updatePost(token, editPostId, editText);
    setEditPostId(null);
    setEditText("");
    await reloadPosts();
  } catch (err: any) {
    setEditError(err?.response?.data?.message || "Update failed");
  } finally {
    setEditingPost(false);
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
