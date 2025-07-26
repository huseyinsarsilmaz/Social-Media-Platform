import { Post, UserSimple } from "@/interface/interfaces";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import PostCard from "./PostCard";

interface Props {
  posts: Post[];
  user: UserSimple;
  loading: boolean;
  error: string | null;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  isOwnUser: boolean;
}

export default function PostList({
  posts,
  loading,
  error,
  user,
  onEdit,
  onDelete,
  isOwnUser,
}: Props) {
  return (
    <Container maxWidth="sm" sx={{ mt: 3, mb: 4 }}>
      <PostListHeader />
      <PostListContent
        posts={posts}
        user={user}
        loading={loading}
        error={error}
        onEdit={onEdit}
        onDelete={onDelete}
        isOwnUser={isOwnUser}
      />
    </Container>
  );
}

function PostListHeader() {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
        Your Posts
      </Typography>
    </>
  );
}

function PostListContent({
  posts,
  loading,
  error,
  user,
  onEdit,
  onDelete,
  isOwnUser,
}: {
  posts: Post[];
  loading: boolean;
  error: string | null;
  user: UserSimple;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  isOwnUser: boolean;
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
        You have not posted anything yet.
      </Typography>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          user={user}
          post={post}
          onEdit={() => onEdit(post)}
          onDelete={onDelete}
          isOwnUser={isOwnUser}
        />
      ))}
    </>
  );
}
