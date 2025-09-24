"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Typography,
  CircularProgress,
  Button,
  Box,
} from "@mui/material";

import useAuthToken from "../../common/hooks/useAuthToken";

import ThreeColumnLayout from "../../layouts/ThreeColumnLayout";
import Sidebar from "../../common/components/Sidebar";
import Trending from "../../common/components/Trending";
import PostCard from "../../common/components/PostCard";
import EditPostDialog from "../../common/components/EditPostDialog";
import NewPostDialog from "../../common/components/NewPostDialog";
import {
  handleDeletePost,
  handleEditPost,
} from "../../common/handlers/commonHandlers";
import { fetchPostWithReplies } from "./postActions";
import { PostWithReplies } from "@/interface/interfaces";

export default function PostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = Number(params?.postId);

  const { token, ownUsername } = useAuthToken();

  const [data, setData] = useState<PostWithReplies | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editingPost, setEditingPost] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [postOpen, setPostOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchPostWithReplies(token!, postId);
      setData(res.data.data);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && postId) loadData();
  }, [token, postId]);

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

  if (!data) return null;

  const renderReplies = (replies: typeof data.children) =>
    replies?.map((child) => (
      <Box key={child.post.id} sx={{ ml: 4 }}>
        <PostCard
          post={child.post}
          user={child.user}
          onEdit={(p) => {
            setEditPostId(p.id);
            setEditText(p.text);
          }}
          onDelete={(id) => handleDeletePost(token, id, loadData)}
          reload={loadData}
          isOwnUser={child.user.username === ownUsername}
          referencedPost={data.self?.post || undefined}
          referencedUser={data.self?.user || undefined}
        />
      </Box>
    ));

  return (
    <ThreeColumnLayout
      left={
        <Sidebar onPostOpen={() => setPostOpen(true)} username={ownUsername} />
      }
      center={
        <>
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
                loadData
              )
            }
          />

          <NewPostDialog
            open={postOpen}
            profilePicture={data.self?.user.profilePicture || ""}
            onClose={() => setPostOpen(false)}
            onPostSuccess={loadData}
          />

          <Box sx={{ mt: 2 }}>
            {data.parent && (
              <PostCard
                post={data.parent.post}
                user={data.parent.user}
                onEdit={(p) => {
                  setEditPostId(p.id);
                  setEditText(p.text);
                }}
                onDelete={(id) => handleDeletePost(token, id, loadData)}
                reload={loadData}
                isOwnUser={data.parent.user.username === ownUsername}
              />
            )}

            {data.self && (
              <Box sx={{ position: "relative", mt: 4 }}>
                {data.parent && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -24,
                      left: 24, // align with avatar
                      width: 2,
                      height: 24,
                      bgcolor: "gray",
                    }}
                  />
                )}

                <PostCard
                  post={data.self.post}
                  user={data.self.user}
                  onEdit={(p) => {
                    setEditPostId(p.id);
                    setEditText(p.text);
                  }}
                  onDelete={(id) => handleDeletePost(token, id, loadData)}
                  reload={loadData}
                  isOwnUser={data.self.user.username === ownUsername}
                  referencedPost={data.parent?.post || undefined}
                  referencedUser={data.parent?.user || undefined}
                />
              </Box>
            )}

            {data.children && data.children?.length > 0 && (
              <Box sx={{ ml: 6, mt: 2 }}>
                {data.children.map((child) => (
                  <Box
                    key={child.post.id}
                    sx={{
                      mb: 2,
                      transform: "scale(0.95)",
                      transformOrigin: "top left",
                    }}
                  >
                    <PostCard
                      post={child.post}
                      user={child.user}
                      onEdit={(p) => {
                        setEditPostId(p.id);
                        setEditText(p.text);
                      }}
                      onDelete={(id) => handleDeletePost(token, id, loadData)}
                      reload={loadData}
                      isOwnUser={child.user.username === ownUsername}
                      referencedPost={data.self?.post || undefined}
                      referencedUser={data.self?.user || undefined}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </>
      }
      right={<Trending />}
    />
  );
}
