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
import useAuthToken from "../hooks/useAuthToken";
import {
  handleLikeButtonClick,
  handleRepostButtonClick,
} from "../handlers/commonHandlers";
import NewPostDialog from "./NewPostDialog";

interface PostCardProps {
  post: Post;
  user: UserSimple;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  reload: () => Promise<void>;
  isOwnUser: boolean;
  referencedPost?: Post;
  referencedUser?: UserSimple;
}

export default function PostCard({
  post,
  user,
  onEdit,
  onDelete,
  reload,
  isOwnUser,
  referencedPost,
  referencedUser,
  hideStats = false,
}: PostCardProps & { hideStats?: boolean }) {
  const avatarSrc = user.profilePicture
    ? `http://localhost:8080/api/users/images/${user.profilePicture}`
    : undefined;

  const actualPost =
    post.type === "REPOST" && referencedPost ? referencedPost : post;
  const actualUser =
    post.type === "REPOST" && referencedUser ? referencedUser : user;

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
      {post.deleted ? (
        <Typography
          sx={{
            fontSize: "0.95rem",
            mt: 0.5,
            fontStyle: "italic",
            color: "gray",
          }}
        >
          {post.text}
        </Typography>
      ) : (
        <>
          {post.type === "REPOST" && referencedUser && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1, color: "gray" }}
            >
              <Repeat fontSize="small" />
              <Typography variant="body2">{user.name} reposted</Typography>
            </Stack>
          )}

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
                user={actualUser}
                post={actualPost}
                onEdit={onEdit}
                onDelete={onDelete}
                isOwnUser={isOwnUser}
              />

              {post.type === "QUOTE" && referencedPost && referencedUser ? (
                <>
                  <Typography sx={{ fontSize: "0.95rem", mt: 0.5 }}>
                    {post.text}
                  </Typography>
                  <Box
                    sx={{
                      mt: 1,
                      border: "1px solid #2f2f2f",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <PostCard
                      post={referencedPost}
                      user={referencedUser}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      reload={reload}
                      isOwnUser={false}
                      hideStats
                    />
                  </Box>
                </>
              ) : post.type === "REPOST" && referencedPost && referencedUser ? (
                <Typography sx={{ fontSize: "0.95rem", mt: 0.5 }}>
                  {referencedPost.text}
                </Typography>
              ) : (
                <Typography sx={{ fontSize: "0.95rem", mt: 0.5 }}>
                  {post.text}
                </Typography>
              )}

              {!hideStats && (
                <PostStats
                  post={actualPost}
                  reload={reload}
                  profilePicture={user.profilePicture}
                  referencedUser={actualUser}
                />
              )}
            </Stack>
          </Stack>
        </>
      )}
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
        <Link href={`/posts/${post.id}`} style={{ textDecoration: "none" }}>
          <Typography
            variant="body2"
            color="gray"
            sx={{ ml: 1, fontSize: "0.9rem" }}
            component="span"
          >
            • {timestamp}
          </Typography>{" "}
        </Link>
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

function PostStats({
  post,
  reload,
  referencedPost,
  referencedUser,
  profilePicture,
}: {
  post: Post;
  reload: () => Promise<void>;
  referencedPost?: Post;
  referencedUser?: UserSimple;
  profilePicture: string | null | undefined;
}) {
  const { token } = useAuthToken();
  const [liked, setLiked] = useState(post.liked);
  const [reposted, setReposted] = useState(post.reposted);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [replyCount, setReplyCount] = useState(post.replyCount);
  const [repostCount, setRepostCount] = useState(post.repostCount);

  const [openQuoteDialog, setOpenQuoteDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openRepostMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const closeRepostMenu = () => setAnchorEl(null);

  const handleRepost = () => {
    if (!token) return (window.location.href = "/login");
    handleRepostButtonClick(
      reposted,
      token,
      post.id,
      setReposted,
      setRepostCount,
      reload
    );
    closeRepostMenu();
  };

  const handleQuote = () => {
    if (!token) return (window.location.href = "/login");
    setOpenQuoteDialog(true);
    closeRepostMenu();
  };

  const quotePost =
    post.type === "REPOST" && referencedPost ? referencedPost : post;

  return (
    <>
      <Divider sx={{ bgcolor: "#2f2f2f", my: 1 }} />
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ color: "gray" }}
      >
        <Stat
          icon={
            <ChatBubbleOutline fontSize="small" sx={{ cursor: "pointer" }} />
          }
          count={replyCount}
        />
        <Stat
          icon={
            <>
              <IconButton
                size="small"
                onClick={openRepostMenu}
                sx={{ color: reposted ? "#1d9bf0" : "inherit" }}
              >
                <Repeat fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={closeRepostMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
              >
                {reposted
                  ? [
                      <MenuItem key="undo" onClick={handleRepost}>
                        Undo Repost
                      </MenuItem>,
                      <MenuItem key="quote" onClick={handleQuote}>
                        Quote Post
                      </MenuItem>,
                    ]
                  : [
                      <MenuItem key="repost" onClick={handleRepost}>
                        Repost
                      </MenuItem>,
                      <MenuItem key="quote" onClick={handleQuote}>
                        Quote Post
                      </MenuItem>,
                    ]}
              </Menu>
            </>
          }
          count={repostCount}
        />
        <Stat
          icon={
            liked ? (
              <Favorite
                fontSize="small"
                sx={{ color: "#e0245e" }}
                onClick={() =>
                  handleLikeButtonClick(liked, token, post.id, setLiked, reload)
                }
              />
            ) : (
              <FavoriteBorder
                fontSize="small"
                onClick={() =>
                  handleLikeButtonClick(liked, token, post.id, setLiked, reload)
                }
              />
            )
          }
          count={likeCount}
        />
        <Stat icon={<Share fontSize="small" />} />
      </Stack>

      {openQuoteDialog && (
        <NewPostDialog
          open={openQuoteDialog}
          profilePicture={profilePicture}
          onClose={() => setOpenQuoteDialog(false)}
          onPostSuccess={reload}
          quotedPost={quotePost}
          referencedUser={referencedUser}
        />
      )}
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
