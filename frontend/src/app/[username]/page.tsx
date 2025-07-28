"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Typography, CircularProgress, Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";

import {
  fetchUserPosts,
  updateProfile,
  uploadImage,
  fetchUserFollowings,
  fetchUserFollowers,
} from "./profileActions";

import {
  ApiResponse,
  Post,
  PostWithUser,
  UserSimple,
} from "@/interface/interfaces";

import ProfileHeader from "./components/ProfileHeader";
import EditProfileDialog from "./components/EditProfileDialog";
import EditPostDialog from "../components/EditPostDialog";
import PostList from "../components/PostList";
import ThreeColumnLayout from "../layouts/ThreeColumnLayout";
import Sidebar from "../components/Sidebar";
import Trending from "../components/Trending";
import NewPostDialog from "../components/NewPostDialog";
import { deletePost, fetchUser, updatePost } from "../components/commonActions";

interface DecodedToken {
  sub: string;
  [key: string]: unknown;
}

function useAuthToken(router: ReturnType<typeof useRouter>) {
  const [token, setToken] = useState<string | null>(null);
  const [ownUsername, setOwnUsername] = useState<string | null>(null);

  useEffect(() => {
    const authToken = localStorage.getItem("AUTH_TOKEN");
    if (!authToken) {
      router.push("/login");
      return;
    }
    setToken(authToken);

    try {
      const decoded = jwtDecode<DecodedToken>(authToken);
      setOwnUsername(decoded.sub);
    } catch {
      router.push("/login");
    }
  }, [router]);

  return { token, ownUsername };
}

function useUserProfile(token: string | null, username: string | null) {
  const [user, setUser] = useState<UserSimple | null>(null);
  const [followings, setFollowings] = useState<UserSimple[]>([]);
  const [followers, setFollowers] = useState<UserSimple[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfileData = useCallback(async () => {
    if (!token || !username) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetchUser(token, username);
      const fetchedUser = (res.data as ApiResponse).data;
      setUser(fetchedUser);

      const followingRes = await fetchUserFollowings(token, fetchedUser.id, 0);
      setFollowings((followingRes.data as ApiResponse).data.content || []);

      const followersRes = await fetchUserFollowers(token, fetchedUser.id, 0);
      setFollowers((followersRes.data as ApiResponse).data.content || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [token, username]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  return {
    user,
    followings,
    followers,
    loading,
    error,
    reload: loadProfileData,
    setUser,
  };
}

function useUserPosts(token: string | null, user: UserSimple | null) {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    if (!token || !user) return;
    setLoading(true);
    setError(null);
    try {
      const postsRes = await fetchUserPosts(token, user.id);
      const rawPosts = (postsRes.data as ApiResponse).data.content || [];
      const wrappedPosts = rawPosts.map((post: Post) => ({ user, post }));
      setPosts(wrappedPosts);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return { posts, loading, error, reload: loadPosts, setPosts };
}

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const usernameParam = params?.username as string | undefined;

  const { token, ownUsername } = useAuthToken(router);

  const {
    user,
    followings,
    followers,
    loading: userLoading,
    error: userError,
    reload: reloadUser,
    setUser,
  } = useUserProfile(token, usernameParam ?? null);

  const {
    posts,
    loading: postsLoading,
    error: postsError,
    reload: reloadPosts,
    setPosts,
  } = useUserPosts(token, user);

  // Profile edit dialog state
  const [form, setForm] = useState({
    email: "",
    username: "",
    name: "",
    bio: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Image uploading state
  const [uploading, setUploading] = useState({ profile: false, cover: false });

  // Post dialogs state
  const [postOpen, setPostOpen] = useState(false);
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editingPost, setEditingPost] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Initialize form when editing opens
  useEffect(() => {
    if (isEditing && user) {
      setForm({
        email: user.email,
        username: user.username,
        name: user.name,
        bio: user.bio || "",
      });
      setSaveError(null);
    }
  }, [isEditing, user]);

  // Handlers
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
      reloadPosts();
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
      reloadPosts();
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

  const handleEditOpen = () => setIsEditing(true);

  // Render logic
  if (userLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (userError) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error" mb={2}>
          {userError}
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
        <Sidebar onPostOpen={() => setPostOpen(true)} username={ownUsername} />
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
              onPostSuccess={reloadPosts}
            />
          )}

          <PostList
            posts={posts}
            ownUsername={user.username}
            loading={postsLoading}
            error={postsError}
            onEdit={(post) => {
              setEditPostId(post.id);
              setEditText(post.text);
            }}
            onDelete={handleDeletePost}
          />
        </>
      }
      right={<Trending />}
    />
  );
}
