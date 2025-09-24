"use client";

import { useState } from "react";
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

import NewPostBox from "./components/NewPostBox";
import ThreeColumnLayout from "../layouts/ThreeColumnLayout";

import useAuthToken from "../common/hooks/useAuthToken";
import Sidebar from "../common/components/Sidebar";
import PostList from "../common/components/PostList";
import EditPostDialog from "../common/components/EditPostDialog";
import NewPostDialog from "../common/components/NewPostDialog";
import Trending from "../common/components/Trending";
import {
  handleDeletePost,
  handleEditPost,
} from "../common/handlers/commonHandlers";

export default function HomePage() {
  const router = useRouter();
  const { token, ownUsername } = useAuthToken();

  const { user, error: userError } = useUser(token);
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
              onRepost={reloadFeed}
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
