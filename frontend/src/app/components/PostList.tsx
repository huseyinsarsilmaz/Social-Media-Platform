import { Post, PostWithUser, UserSimple } from "@/interface/interfaces";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import PostCard from "./PostCard";

interface Props {
  posts: PostWithUser[];
  ownUsername: String | null;
  loading: boolean;
  error: string | null;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}

export default function PostList({
  posts,
  loading,
  error,
  ownUsername,
  onEdit,
  onDelete,
}: Props) {
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
    <Container maxWidth="sm" sx={{ mt: 3, mb: 4 }}>
      {posts.map((pwu) => (
        <PostCard
          key={pwu.post.id}
          user={pwu.user}
          post={pwu.post}
          onEdit={() => onEdit(pwu.post)}
          onDelete={onDelete}
          isOwnUser={ownUsername === pwu.user.username}
        />
      ))}
    </Container>
  );
}
