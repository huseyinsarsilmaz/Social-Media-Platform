import { PostWithUser } from "@/interface/interfaces";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import PostCard from "./PostCard";

interface Props {
  posts: PostWithUser[];
  loading: boolean;
  error: string | null;
  onEdit: (post: PostWithUser["post"]) => void;
  onDelete: (id: number) => void;
}

export default function PostList({
  posts,
  loading,
  error,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Container maxWidth="sm" sx={{ mt: 3, mb: 4 }}>
      <PostListHeader />
      <PostListContent
        posts={posts}
        loading={loading}
        error={error}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Container>
  );
}

function PostListHeader() {
  return (
    <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
      Your Posts
    </Typography>
  );
}

function PostListContent({
  posts,
  loading,
  error,
  onEdit,
  onDelete,
}: {
  posts: PostWithUser[];
  loading: boolean;
  error: string | null;
  onEdit: (post: PostWithUser["post"]) => void;
  onDelete: (id: number) => void;
}) {
  if (loading) {
    return (
      <Box sx={{ textAlign: "center", py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mb: 2 }}>
        {error}
      </Typography>
    );
  }

  if (posts.length === 0) {
    return (
      <Typography sx={{ color: "gray" }}>
        No posts to display.
      </Typography>
    );
  }

  return (
    <>
      {posts.map((postWithUser) => (
        <PostCard
          key={postWithUser.post.id}
          postWithUser={postWithUser}
          onEdit={() => onEdit(postWithUser.post)}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
