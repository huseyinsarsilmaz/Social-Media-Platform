"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Typography, CircularProgress, Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";

import {
  fetchUser,
  fetchUserPosts,
  updateProfile,
  updatePost,
  deletePost,
  uploadImage,
  fetchUserFollowings,
  fetchUserFollowers,
} from "./profileActions";

import { ApiResponse, Post, UserSimple } from "@/interface/interfaces";

import ProfileHeader from "./components/ProfileHeader";
import EditProfileDialog from "./components/EditProfileDialog";
import EditPostDialog from "./components/EditPostDialog";
import NewPostDialog from "./components/NewPostDialog";
import PostList from "../components/PostList";
import ThreeColumnLayout from "../layouts/ThreeColumnLayout";
import Sidebar from "../components/Sidebar";
import Trending from "./components/Trending";

interface DecodedToken {
  sub: string;
  [key: string]: any;
}

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const usernameParam = params?.username as string;

  const [token, setToken] = useState<string | null>(null);
  const [ownUsername, setOwnUsername] = useState<string | null>(null);
  const [user, setUser] = useState<UserSimple | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followings, setFollowings] = useState<UserSimple[]>([]);
  const [followers, setFollowers] = useState<UserSimple[]>([]);

  const [form, setForm] = useState({
    email: "",
    username: "",
    name: "",
    bio: "",
  });

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
      const decoded = jwtDecode<DecodedToken>(authToken);
      setOwnUsername(decoded.sub);
    }
  }, []);

  const loadPosts = useCallback(async (token: string, userId: number) => {
    setPostsLoading(true);
    setPostsError(null);
    try {
      const res = await fetchUserPosts(token, userId);
      const data = (res.data as ApiResponse).data.content;
      setPosts(data || []);
    } catch (err: any) {
      setPostsError(err?.response?.data?.message || "Failed to fetch posts");
    } finally {
      setPostsLoading(false);
    }
  }, []);

  const loadUser = useCallback(
    async (token: string, username: string) => {
      try {
        const res = await fetchUser(token, username);
        const data = (res.data as ApiResponse).data;
        setUser(data);

        const followingRes = await fetchUserFollowings(token, data.id, 0);
        const followingData =
          (followingRes.data as ApiResponse).data.content || [];
        const followersRes = await fetchUserFollowers(token, data.id, 0);
        const followersData =
          (followersRes.data as ApiResponse).data.content || [];
        setFollowings(followingData);
        setFollowers(followersData);

        await loadPosts(token, data.id);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    },
    [loadPosts]
  );

  useEffect(() => {
    if (token && usernameParam) {
      loadUser(token, usernameParam);
    }
  }, [token, usernameParam, loadUser]);

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
      if (user) await loadPosts(token, user.id);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete post");
    }
  };

  const handleEditPost = async () => {
    if (!token || !editPostId || !user) return;
    setEditingPost(true);
    setEditError(null);
    try {
      await updatePost(token, editPostId, editText);
      setEditPostId(null);
      setEditText("");
      await loadPosts(token, user.id);
    } catch (err: any) {
      setEditError(err?.response?.data?.message || "Update failed");
    } finally {
      setEditingPost(false);
    }
  };

  const handleImageUpload = async (file: File, type: "profile" | "cover") => {
    if (!token) return;
    const formData = new FormData();
    formData.append(
      type === "profile" ? "profilePicture" : "coverPicture",
      file
    );
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
          <Typography color="error" mb={2}>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </Container>
      );
    }

    if (!user) return null;

    return (
      <ThreeColumnLayout
        left={
          <Sidebar
            onPostOpen={() => setPostOpen(true)}
            username={ownUsername}
          />
        }
        center={
          <>
            <ProfileHeader
              user={user}
              followings={followings}
              followers={followers}
              onEditClick={handleEditOpen}
              isOwnUser={ownUsername === usernameParam}
            />

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

            {ownUsername === usernameParam && (
              <NewPostDialog
                open={postOpen}
                profilePicture={user.profilePicture}
                onClose={() => setPostOpen(false)}
                onPostSuccess={() => token && loadPosts(token, user.id)}
              />
            )}

            <PostList
              posts={posts}
              user={user}
              loading={postsLoading}
              error={postsError}
              onEdit={(post) => {
                setEditPostId(post.id);
                setEditText(post.text);
              }}
              onDelete={handleDeletePost}
              isOwnUser={ownUsername === usernameParam}
            />
          </>
        }
        right={<Trending />}
      />
    );
  };

  return renderContent();
}
