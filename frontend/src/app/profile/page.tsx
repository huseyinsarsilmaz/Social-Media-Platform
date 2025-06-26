"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, CircularProgress, Button } from "@mui/material";

import {
  fetchUser,
  fetchUserPosts,
  updateProfile,
  updatePost,
  deletePost,
  uploadImage,
} from "./profileActions";

import { ApiResponse, Post, UserSimple } from "@/interface/interfaces";

import ProfileHeader from "./components/ProfileHeader";
import EditProfileDialog from "./components/EditProfileDialog";
import EditPostDialog from "./components/EditPostDialog";
import NewPostDialog from "./components/NewPostDialog";
import PostList from "./components/PostList";

export default function ProfilePage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserSimple | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState({ email: "", username: "", name: "", bio: "" });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploading, setUploading] = useState({ profile: false, cover: false });

  const [isEditing, setIsEditing] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState<string | null>(null);

  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editingPost, setEditingPost] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    const authToken = localStorage.getItem("AUTH_TOKEN");
    if (!authToken) {
      router.push("/login");
    } else {
      setToken(authToken);
    }
  }, []);

  const loadUser = useCallback(async (token: string) => {
    try {
      const res = await fetchUser(token);
      const data = (res.data as ApiResponse).data;
      setUser(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPosts = useCallback(async (token: string) => {
    setPostsLoading(true);
    setPostsError(null);
    try {
      const res = await fetchUserPosts(token);
      const data = (res.data as ApiResponse).data;
      setPosts(data || []);
    } catch (err: any) {
      setPostsError(err?.response?.data?.message || "Failed to fetch posts");
    } finally {
      setPostsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadUser(token);
      loadPosts(token);
    }
  }, [token, loadUser, loadPosts]);

  const handleEditOpen = () => {
    if (!user) return;
    setForm({
      email: user.email,
      username: user.username,
      name: user.name,
      bio: user.bio || "",
    });
    setSaveError(null);
    setIsEditing(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSave = async () => {
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
  };

  const handleDeletePost = async (id: number) => {
    if (!token || !confirm("Delete this post?")) return;
    try {
      await deletePost(token, id);
      loadPosts(token);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete post");
    }
  };

  const handleEditPost = async () => {
    if (!token || !editPostId) return;
    setEditingPost(true);
    setEditError(null);
    try {
      await updatePost(token, editPostId, editText);
      setEditPostId(null);
      setEditText("");
      loadPosts(token);
    } catch (err: any) {
      setEditError(err?.response?.data?.message || "Update failed");
    } finally {
      setEditingPost(false);
    }
  };

  const handleImageUpload = async (file: File, type: "profile" | "cover") => {
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
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
          <CircularProgress />
        </Container>
      );
    }

    if (error) {
      return (
        <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
          <Typography color="error" mb={2}>{error}</Typography>
          <Button variant="contained" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </Container>
      );
    }

    if (!user) return null;

    return (
      <>
        <ProfileHeader user={user} onEditClick={handleEditOpen} />

        <EditProfileDialog
          open={isEditing}
          onClose={() => setIsEditing(false)}
          user={user}
          form={form}
          onFormChange={handleFormChange}
          onSave={handleProfileSave}
          saving={saving}
          saveError={saveError}
          handleImageUpload={handleImageUpload}
          profileUploading={uploading.profile}
          coverUploading={uploading.cover}
        />

        <EditPostDialog
          open={editPostId !== null}
          onClose={() => setEditPostId(null)}
          editText={editText}
          setEditText={setEditText}
          editingPost={editingPost}
          editError={editError}
          onSave={handleEditPost}
        />

        <NewPostDialog
          open={postOpen}
          onClose={() => setPostOpen(false)}
          onPostSuccess={() => token && loadPosts(token)}
        />

        <PostList
          posts={posts}
          loading={postsLoading}
          error={postsError}
          onEdit={(post) => {
            setEditPostId(post.id);
            setEditText(post.text);
          }}
          onDelete={handleDeletePost}
          onPostOpen={() => setPostOpen(true)}
        />
      </>
    );
  };

  return renderContent();
}
