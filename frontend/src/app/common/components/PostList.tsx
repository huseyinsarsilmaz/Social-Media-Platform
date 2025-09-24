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
  onRepost: () => Promise<void>;
}

export default function PostList({
  posts,
  loading,
  error,
  ownUsername,
  onEdit,
  onDelete,
  onRepost,
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

  const postMap = new Map<number, Post>();
  const userMap = new Map<number, UserSimple>();
  posts.forEach((pwu) => {
    postMap.set(pwu.post.id, pwu.post);
    userMap.set(pwu.user.id, pwu.user);
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 3, mb: 4 }}>
      {posts
        .filter((pwu) => !pwu.post.deleted)
        .map((pwu) => {
          const referencedPost =
            pwu.post.type === "REPOST"
              ? postMap.get(pwu.post.repostOfId!)
              : pwu.post.type === "QUOTE"
              ? postMap.get(pwu.post.quoteOfId!)
              : undefined;

          const referencedUser =
            referencedPost !== undefined
              ? userMap.get(referencedPost.userId)
              : undefined;

          return (
            <PostCard
              key={pwu.post.id}
              user={pwu.user}
              post={pwu.post}
              onEdit={() => onEdit(pwu.post)}
              onDelete={onDelete}
              reload={onRepost}
              isOwnUser={ownUsername === pwu.user.username}
              referencedPost={referencedPost}
              referencedUser={referencedUser}
            />
          );
        })}
    </Container>
  );
}
