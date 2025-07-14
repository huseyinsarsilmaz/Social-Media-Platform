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
} from "@mui/material";
import { useState } from "react";
import ImageSharp from "@mui/icons-material/ImageSharp";
import CloseIcon from "@mui/icons-material/Close";
import { createPost } from "../homeActions";

interface Props {
  open: boolean;
  profilePicture: string | null | undefined;
  onClose: () => void;
  onPostSuccess: () => void;
}

const textFieldStyles = {
  bgcolor: "#121212",
  borderRadius: 1,
  "& .MuiInputBase-input": { color: "#fff" },
  "& .MuiOutlinedInput-root": {
    border: "none",
    "&:hover fieldset": { borderColor: "transparent" },
    "& fieldset": { borderColor: "transparent" },
    "&.Mui-focused fieldset": { borderColor: "transparent" },
  },
  "& .MuiInputLabel-root": {
    display: "none",
  },
};

export default function NewPostDialog({
  open,
  profilePicture,
  onClose,
  onPostSuccess,
}: Props) {
  const [postText, setPostText] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const handlePost = async () => {
    setPosting(true);
    setPostError(null);
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      await createPost(token, postText);
      setPostText("");
      onClose();
      onPostSuccess();
    } catch (err: any) {
      setPostError(err?.response?.data?.message || "Failed to post.");
    } finally {
      setPosting(false);
    }
  };

  const avatarUrl = `http://localhost:8080/api/users/images/${profilePicture}`;

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
          disabled={posting}
          size="small"
          sx={{ color: "#fff" }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent dividers sx={{ borderColor: "#2f2f2f" }}>
        <PostError message={postError} />
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <Avatar
            src={avatarUrl}
            alt="User Avatar"
            sx={{ width: 40, height: 40, mt: "6px" }}
          />
          <PostTextField
            value={postText}
            onChange={setPostText}
            disabled={posting}
          />
        </Box>
        <PostImageHint />
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            if (posting || !postText.trim()) return;
            handlePost();
          }}
          sx={{
            opacity: posting || !postText.trim() ? 0.6 : 1,
            pointerEvents: posting || !postText.trim() ? "none" : "auto",
            transition: "opacity 0.3s ease",
          }}
        >
          {posting ? <CircularProgress size={24} /> : "Post"}
        </Button>
      </DialogActions>
    </Dialog>
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
      sx={textFieldStyles}
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
