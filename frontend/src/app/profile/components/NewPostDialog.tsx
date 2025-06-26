import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import { useState } from "react";
import ImageSharp from "@mui/icons-material/ImageSharp";
import { createPost } from "../profileActions";

interface Props {
  open: boolean;
  onClose: () => void;
  onPostSuccess: () => void;
}

const textFieldStyles = {
  bgcolor: "#1e1e1e",
  borderRadius: 1,
  "& label": { color: "rgba(255, 255, 255, 0.7)" },
  "& label.Mui-focused": { color: "#fff" },
  "& .MuiInputBase-input": { color: "#fff" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
    "&:hover fieldset": { borderColor: "#fff" },
    "&.Mui-focused fieldset": { borderColor: "#fff" },
  },
};

export default function NewPostDialog({ open, onClose, onPostSuccess }: Props) {
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
      <DialogTitle>New Post</DialogTitle>
      <DialogContent dividers sx={{ borderColor: "#2f2f2f" }}>
        <PostError message={postError} />
        <PostTextField
          value={postText}
          onChange={setPostText}
          disabled={posting}
        />
        <PostImageHint />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={posting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handlePost}
          disabled={posting || !postText.trim()}
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
      label="What's happening?"
      multiline
      minRows={3}
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      sx={textFieldStyles}
      disabled={disabled}
    />
  );
}

function PostImageHint() {
  return (
    <Box mt={2} textAlign="right">
      <ImageSharp />
    </Box>
  );
}
