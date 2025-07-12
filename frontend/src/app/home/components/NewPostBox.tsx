"use client";

import {
  Alert,
  Avatar,
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

export default function NewPostBox({
  onPostSuccess,
  profilePicture,
}: {
  onPostSuccess: () => void;
  profilePicture: string | null;
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

  const avatarUrl = profilePicture
    ? `http://localhost:8080/api/users/images/${profilePicture}`
    : undefined;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        mb: 2,
        bgcolor: "#121212",
        color: "#fff",
        borderRadius: 2,
      }}
    >
      {postError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {postError}
        </Alert>
      )}

      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Avatar
          src={avatarUrl}
          alt="User Avatar"
          sx={{ width: 40, height: 40, mt: "6px" }}
        />
        <TextField
          placeholder="What's happening?"
          multiline
          minRows={3}
          fullWidth
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          variant="outlined"
          sx={textFieldStyles}
          disabled={posting}
          InputLabelProps={{ shrink: false }}
        />
      </Box>

      <Box
        mt={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box textAlign="left">
          <ImageSharp />
        </Box>

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
      </Box>
    </Paper>
  );
}
