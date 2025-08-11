import { Post, UserSimple } from "@/interface/interfaces";
import {
  ChatBubbleOutline,
  Favorite,
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
import { useState, useMemo } from "react";
import Link from "next/link";

interface PostCardProps {
  post: Post;
  user: UserSimple;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  isOwnUser: boolean;
}

export default function PostCard({
  post,
  user,
  onEdit,
  onDelete,
  isOwnUser,
}: PostCardProps) {
  const avatarSrc = user.profilePicture
    ? `http://localhost:8080/api/users/images/${user.profilePicture}`
    : undefined;

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
        <Link href={`/${user.username}`} style={{ textDecoration: "none" }}>
          <Avatar
            src={avatarSrc}
            alt={user.name}
            sx={{ width: 40, height: 40, cursor: "pointer" }}
          />
        </Link>

        <Stack flex={1}>
          <PostHeader
            user={user}
            post={post}
            onEdit={onEdit}
            onDelete={onDelete}
            isOwnUser={isOwnUser}
          />
          <Typography sx={{ fontSize: "0.95rem", mt: 0.5 }}>
            {post.text}
          </Typography>
          <PostStats post={post} />
        </Stack>
      </Stack>
    </Box>
  );
}

interface PostHeaderProps {
  user: UserSimple;
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  isOwnUser: boolean;
}

function PostHeader({
  user,
  post,
  onEdit,
  onDelete,
  isOwnUser,
}: PostHeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const timestamp = useMemo(
    () => formatTimestamp(post.createdAt),
    [post.createdAt]
  );

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center" flexWrap="wrap">
        <Link
          href={`/${user.username}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography
            fontWeight={600}
            sx={{ fontSize: "0.95rem", cursor: "pointer" }}
          >
            {user.name}
          </Typography>
        </Link>
        <Link
          href={`/${user.username}`}
          style={{ textDecoration: "none", color: "gray" }}
        >
          <Typography
            variant="body2"
            sx={{ ml: 1, fontSize: "0.9rem", cursor: "pointer" }}
            component="span"
          >
            @{user.username}
          </Typography>
        </Link>
        <Typography
          variant="body2"
          color="gray"
          sx={{ ml: 1, fontSize: "0.9rem" }}
          component="span"
        >
          • {timestamp}
        </Typography>
      </Box>

      {isOwnUser && (
        <>
          <IconButton onClick={openMenu} sx={{ color: "#fff", p: 0 }}>
            <MoreHoriz />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={closeMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => {
                closeMenu();
                onEdit(post);
              }}
            >
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                closeMenu();
                onDelete(post.id);
              }}
            >
              Delete
            </MenuItem>
          </Menu>
        </>
      )}
    </Stack>
  );
}

function PostStats({ post }: { post: Post }) {
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
        <Stat
          icon={
            post.liked ? (
              <Favorite fontSize="small" sx={{ color: "#e0245e" }} />
            ) : (
              <FavoriteBorder fontSize="small" />
            )
          }
          count={post.likeCount}
        />
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
