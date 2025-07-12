"use client";

import {
  Alert,
  Button,
  CircularProgress,
  TextField,
  Paper,
  Box,
} from "@mui/material";
import { useState } from "react";
import ImageSharp from "@mui/icons-material/ImageSharp";
import { createPost } from "../homeActions";

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

export default function NewPostBox({
  onPostSuccess,
}: {
  onPostSuccess: () => void;
}) {
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
      onPostSuccess();
    } catch (err: any) {
      setPostError(err?.response?.data?.message || "Failed to post.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      {postError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {postError}
        </Alert>
      )}
      <TextField
        label="What's happening?"
        multiline
        minRows={3}
        fullWidth
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        variant="outlined"
        sx={textFieldStyles}
        disabled={posting}
      />
      <Box
        mt={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <ImageSharp />
        <Button
          variant="contained"
          onClick={handlePost}
          disabled={posting || !postText.trim()}
        >
          {posting ? <CircularProgress size={24} /> : "Post"}
        </Button>
      </Box>
    </Paper>
  );
}
