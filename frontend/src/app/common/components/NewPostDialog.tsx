import {
  Alert,
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ImageSharp from "@mui/icons-material/ImageSharp";
import CloseIcon from "@mui/icons-material/Close";
import { createPost, createQuote, createReply } from "../commonActions";
import { Post, UserSimple } from "@/interface/interfaces";
import PostCard from "./PostCard";

interface Props {
  open: boolean;
  profilePicture: string | null | undefined;
  onClose: () => void;
  onPostSuccess: () => void;
  referencedPost?: Post;
  referencedUser?: UserSimple | undefined;
  isReply?: boolean;
}

export default function NewPostDialog({
  open,
  profilePicture,
  onClose,
  onPostSuccess,
  referencedPost,
  referencedUser,
  isReply = false,
}: Props) {
  const [postText, setPostText] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("AUTH_TOKEN") : null;
  const avatarUrl = profilePicture
    ? `http://localhost:8080/api/users/images/${profilePicture}`
    : "";

  const handlePost = async () => {
    if (!token) return (window.location.href = "/login");

    setPosting(true);
    setPostError(null);
    try {
      if (isReply && referencedPost) {
        await createReply(token, referencedPost.id, postText);
      } else if (referencedPost) {
        await createQuote(token, referencedPost.id, postText);
      } else {
        await createPost(token, postText);
      }
      setPostText("");
      onClose();
      onPostSuccess();
    } catch (err: any) {
      setPostError(err?.response?.data?.message || "Failed to post.");
    } finally {
      setPosting(false);
    }
  };

  const canPost = !!postText.trim() && !posting;

  return (
    <Dialog
      open={open}
      onClose={() => !posting && onClose()}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { bgcolor: "#121212", color: "#fff", borderRadius: 2 },
      }}
    >
      <Header onClose={onClose} disabled={posting} />
      <DialogContent dividers sx={{ borderColor: "#2f2f2f" }}>
        <PostError message={postError} />

        {isReply && referencedPost && referencedUser && (
          <Box sx={{ position: "relative", mb: 3 }}>
            <PostCard
              post={referencedPost}
              user={referencedUser}
              onEdit={() => {}}
              onDelete={() => {}}
              reload={() => Promise.resolve()}
              isOwnUser={false}
              hideStats
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -12,
                left: 28,
                width: 2,
                height: 12,
                bgcolor: "gray",
              }}
            />
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <Avatar src={avatarUrl} sx={{ width: 40, height: 40, mt: "6px" }} />
          <PostTextField
            value={postText}
            onChange={setPostText}
            disabled={posting}
          />
        </Box>

        {!isReply && referencedPost && referencedUser && (
          <Box mt={2}>
            <PostCard
              post={referencedPost}
              user={referencedUser}
              onEdit={() => {}}
              onDelete={() => {}}
              reload={() => Promise.resolve()}
              isOwnUser={false}
              hideStats
            />
          </Box>
        )}

        <PostImageHint />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handlePost}
          disabled={!canPost}
          sx={{
            opacity: canPost ? 1 : 0.6,
            pointerEvents: canPost ? "auto" : "none",
            transition: "opacity 0.3s ease",
          }}
        >
          {posting ? (
            <CircularProgress size={24} />
          ) : isReply ? (
            "Reply"
          ) : referencedPost ? (
            "Quote"
          ) : (
            "Post"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


function Header({
  onClose,
  disabled,
}: {
  onClose: () => void;
  disabled: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        px: 1.5,
        pt: 1,
        pb: 1.5,
      }}
    >
      <IconButton
        onClick={onClose}
        disabled={disabled}
        size="small"
        sx={{ color: "#fff" }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

function PostError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {message}
    </Alert>
  );
}

function PostTextField({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
}) {
  return (
    <TextField
      placeholder="What's happening?"
      multiline
      minRows={3}
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      sx={{
        bgcolor: "#121212",
        borderRadius: 1,
        "& .MuiInputBase-input": { color: "#fff" },
        "& .MuiOutlinedInput-root": {
          border: "none",
          "&:hover fieldset": { borderColor: "transparent" },
          "& fieldset": { borderColor: "transparent" },
          "&.Mui-focused fieldset": { borderColor: "transparent" },
        },
        "& .MuiInputLabel-root": { display: "none" },
      }}
      disabled={disabled}
      InputLabelProps={{ shrink: false }}
    />
  );
}

function PostImageHint() {
  return (
    <Box mt={2} textAlign="left">
      <ImageSharp />
    </Box>
  );
}
