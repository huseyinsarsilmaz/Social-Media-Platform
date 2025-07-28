"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Button,
} from "@mui/material";

import useUser from "./hooks/useUser";
import useFeed from "./hooks/useFeed";

import Sidebar from "../components/Sidebar";
import NewPostBox from "./components/NewPostBox";
import PostList from "../components/PostList";
import NewPostDialog from "../components/NewPostDialog";
import EditPostDialog from "../components/EditPostDialog";
import ThreeColumnLayout from "../layouts/ThreeColumnLayout";
import Trending from "../components/Trending";

import { handleDeletePost, handleEditPost } from "./handlers/homeHandlers";

export default function HomePage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  React.useEffect(() => {
    const authToken = localStorage.getItem("AUTH_TOKEN");
    if (!authToken) {
      router.push("/login");
    } else {
      setToken(authToken);
    }
  }, [router]);

  const {
    user,
    ownUsername,
    error: userError,
    reload: reloadUser,
  } = useUser(token);
  const {
    posts,
    loading,
    error: feedError,
    reload: reloadFeed,
  } = useFeed(token);

  const [postOpen, setPostOpen] = useState(false);
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editingPost, setEditingPost] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  if (loading) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (userError || feedError) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error" mb={2}>
          {userError || feedError}
        </Typography>
        <Button variant="contained" onClick={() => router.push("/login")}>
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
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
              onPostSuccess={reloadFeed}
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
              onDelete={(id) => handleDeletePost(token, id, reloadFeed)}
            />
            <EditPostDialog
              open={editPostId !== null}
              onClose={() => setEditPostId(null)}
              editText={editText}
              setEditText={setEditText}
              editingPost={editingPost}
              editError={editError}
              onSave={() =>
                handleEditPost(
                  token,
                  editPostId,
                  editText,
                  setEditingPost,
                  setEditError,
                  setEditPostId,
                  setEditText,
                  reloadFeed
                )
              }
            />
            <NewPostDialog
              open={postOpen}
              profilePicture={user?.profilePicture}
              onClose={() => setPostOpen(false)}
              onPostSuccess={reloadFeed}
            />
          </>
        }
        right={<Trending />}
      />
    </Container>
  );
}
