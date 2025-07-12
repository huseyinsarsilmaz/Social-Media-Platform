import { PostWithUser } from "@/interface/interfaces";
import {
  ChatBubbleOutline,
  Delete,
  Edit,
  FavoriteBorder,
  Repeat,
  Share,
} from "@mui/icons-material";
import { Avatar, Box, Divider, IconButton, Stack, Typography } from "@mui/material";

interface Props {
  postWithUser: PostWithUser;
  onEdit: (post: PostWithUser["post"]) => void;
  onDelete: (id: number) => void;
}

export default function PostCard({ postWithUser, onEdit, onDelete }: Props) {
  const { user, post } = postWithUser;


  return (
    <Box
      sx={{
        bgcolor: "#1e1e1e",
        p: 2,
        borderRadius: 2,
        mb: 2,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <PostHeader user={user} />
      <PostContent text={post.text} />
      <PostActions post={post} onEdit={onEdit} onDelete={onDelete} />
      <Divider sx={{ bgcolor: "#2f2f2f", my: 1 }} />
      <PostStats />
    </Box>
  );
}

function PostHeader({ user }: { user: PostWithUser["user"] }) {

    const avatarUrl = user.profilePicture
      ? `http://localhost:8080/api/users/images/${user.profilePicture}`
      : undefined;

    return (
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={avatarUrl}
          alt={user.name}
          sx={{ width: 40, height: 40 }}
        />
        <Box>
          <Typography fontWeight={600}>{user.name}</Typography>
          <Typography variant="caption" color="gray">
            @{user.username}
          </Typography>
        </Box>
      </Stack>
    );
}

function PostContent({ text }: { text: string }) {
  return <Typography>{text}</Typography>;
}

function PostActions({
  post,
  onEdit,
  onDelete,
}: {
  post: PostWithUser["post"];
  onEdit: (post: PostWithUser["post"]) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Box display="flex" justifyContent="flex-end">
      <Stack direction="row" spacing={1}>
        <IconButton
          size="small"
          onClick={() => onEdit(post)}
          sx={{ color: "#1da1f2" }}
        >
          <Edit fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete(post.id)}
          sx={{ color: "red" }}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}

function PostStats() {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ color: "gray" }}
    >
      <Stat icon={<ChatBubbleOutline fontSize="small" />} count={0} />
      <Stat icon={<Repeat fontSize="small" />} count={0} />
      <Stat icon={<FavoriteBorder fontSize="small" />} count={0} />
      <Stat icon={<Share fontSize="small" />} />
    </Stack>
  );
}

function Stat({ icon, count }: { icon: React.ReactNode; count?: number }) {
  return (
    <Stack
      direction="row"
      spacing={0.5}
      alignItems="center"
      sx={{ cursor: "pointer" }}
    >
      {icon}
      {count !== undefined && (
        <Typography variant="caption">{count}</Typography>
      )}
    </Stack>
  );
}
