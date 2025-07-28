"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Button,
} from "@mui/material";

import {
  ApiResponse,
  JwtPayload,
  PostWithUser,
  UserSimple,
} from "@/interface/interfaces";

import { deletePost, fetchUser, updatePost } from "../components/commonActions";

import NewPostBox from "./components/NewPostBox";
import ThreeColumnLayout from "../layouts/ThreeColumnLayout";
import Sidebar from "../components/Sidebar";
import PostList from "../components/PostList";
import NewPostDialog from "../components/NewPostDialog";
import EditPostDialog from "../components/EditPostDialog";
import { fetchFeed } from "./homeActions";
import Trending from "../components/Trending";

export default function HomePage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [user, setUser] = useState<UserSimple | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postOpen, setPostOpen] = useState(false);
  const [ownUsername, setOwnUsername] = useState<string | null>(null);

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
      const decoded = jwtDecode<JwtPayload>(token);
      setOwnUsername(decoded.sub);
      const res = await fetchUser(token, decoded.sub);
      const data = (res.data as ApiResponse).data;
      setUser(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch user");
    }
  }, []);

  const loadFeed = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFeed(token, 0);
      const data = (res.data as ApiResponse).data.content;
      setPosts(data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch feed");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeletePost = async (id: number) => {
    if (!token || !confirm("Delete this post?")) return;
    try {
      await deletePost(token, id);
      await loadFeed(token);
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
      await loadFeed(token);
    } catch (err: any) {
      setEditError(err?.response?.data?.message || "Update failed");
    } finally {
      setEditingPost(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadUser(token);
      loadFeed(token);
    }
  }, [token, loadUser, loadFeed]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography color="error" mb={2}>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </Box>
      );
    }

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
            <NewPostBox
              profilePicture={user?.profilePicture || null}
              onPostSuccess={() => token && loadFeed(token)}
            />
            <PostList
              ownUsername={ownUsername}
              posts={posts}
              loading={false}
              error={null}
              onEdit={(post) => {
                setEditPostId(post.id);
                setEditText(post.text);
              }}
              onDelete={handleDeletePost}
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
              profilePicture={user?.profilePicture}
              onClose={() => setPostOpen(false)}
              onPostSuccess={() => token && loadFeed(token)}
            />
          </>
        }
        right={<Trending />}
      />
    );
  };

  return <Container maxWidth="lg">{renderContent()}</Container>;
}
