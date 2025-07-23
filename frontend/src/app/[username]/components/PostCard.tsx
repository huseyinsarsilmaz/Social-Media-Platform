import { Post, UserSimple } from "@/interface/interfaces";
import {
  ChatBubbleOutline,
  FavoriteBorder,
  MoreHoriz,
  Repeat,
  Share,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface Props {
  post: Post;
  user: UserSimple;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}

export default function PostCard({ post, user, onEdit, onDelete }: Props) {
  return (
    <Box
      sx={{
        bgcolor: "#1e1e1e",
        p: 2,
        pt: 1,
        borderRadius: 2,
        mb: 2,
        color: "#fff",
      }}
    >
      <Stack direction="row" spacing={2}>
        <Avatar
          src={
            user.profilePicture
              ? `http://localhost:8080/api/users/images/${user.profilePicture}`
              : undefined
          }
          alt={user.name}
          sx={{ width: 40, height: 40 }}
        />
        <Stack flex={1}>
          <PostHeader
            user={user}
            post={post}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          <PostContent text={post.text} />
          <PostStats />
        </Stack>
      </Stack>
    </Box>
  );
}

function PostHeader({
  user,
  post,
  onEdit,
  onDelete,
}: {
  user: UserSimple;
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center" flexWrap="wrap">
        <Typography fontWeight={600} sx={{ fontSize: "0.95rem" }}>
          {user.name}
        </Typography>
        <Typography
          variant="body2"
          color="gray"
          sx={{ ml: 1, fontSize: "0.9rem" }}
          component="span"
        >
          @{user.username} • {formatTimestamp(post.createdAt)}
        </Typography>
      </Box>

      <IconButton onClick={handleOpen} sx={{ color: "#fff", p: 0 }}>
        <MoreHoriz />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onEdit(post);
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onDelete(post.id);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Stack>
  );
}

function PostContent({ text }: { text: string }) {
  return <Typography sx={{ fontSize: "0.95rem" }}>{text}</Typography>;
}

function PostStats() {
  return (
    <>
      <Divider sx={{ bgcolor: "#2f2f2f", my: 1 }} />
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ color: "gray" }}
      >
        <Stat icon={<ChatBubbleOutline fontSize="small" />} count={0} />
        <Stat icon={<Repeat fontSize="small" />} count={0} />
        <Stat icon={<FavoriteBorder fontSize="small" />} count={0} />
        <Stat icon={<Share fontSize="small" />} />
      </Stack>
    </>
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

function formatTimestamp(createdAt: string): string {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 24) {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 60) return rtf.format(-diffMinutes, "minute");
    return rtf.format(-Math.floor(diffHours), "hour");
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
}
