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
import ImageSharp from "@mui/icons-material/ImageSharp";
import { useState } from "react";
import { createPost } from "@/app/common/components/commonActions";

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

  const disabled = posting || !postText.trim();
  const avatarUrl = profilePicture
    ? `http://localhost:8080/api/users/images/${profilePicture}`
    : undefined;

  const handlePost = async () => {
    const token = localStorage.getItem("AUTH_TOKEN");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setPosting(true);
    setPostError(null);
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
            opacity: disabled ? 0.6 : 1,
            pointerEvents: disabled ? "none" : "auto",
            transition: "opacity 0.3s ease",
          }}
        >
          {posting ? <CircularProgress size={24} /> : "Post"}
        </Button>
      </Box>
    </Paper>
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
