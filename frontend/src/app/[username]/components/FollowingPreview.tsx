"use client";

import {
  Avatar,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserSimple } from "@/interface/interfaces";

const getImageUrl = (imageName: string | null) =>
  imageName ? `http://localhost:8080/api/users/images/${imageName}` : undefined;

export default function FollowingPreview({
  followings,
  followers,
}: {
  followings: UserSimple[];
  followers: UserSimple[];
}) {
  const [followingsOpen, setFollowingsOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);

  return (
    <>
      <Stack
        direction="row"
        spacing={4}
        sx={{ mt: 2, color: "rgba(255, 255, 255, 0.6)" }}
      >
        <Box
          onClick={() => setFollowersOpen(true)}
          sx={{
            cursor: "pointer",
            "&:hover span": { textDecoration: "underline" },
          }}
        >
          <Typography component="span" fontWeight="bold" sx={{ color: "#fff" }}>
            {followers.length}
          </Typography>{" "}
          Followers
        </Box>
        <Box
          onClick={() => setFollowingsOpen(true)}
          sx={{
            cursor: "pointer",
            "&:hover span": { textDecoration: "underline" },
          }}
        >
          <Typography component="span" fontWeight="bold" sx={{ color: "#fff" }}>
            {followings.length}
          </Typography>{" "}
          Following
        </Box>
      </Stack>

      <CustomDialog
        open={followingsOpen}
        onClose={() => setFollowingsOpen(false)}
        title="Following"
        users={followings}
      />
      <CustomDialog
        open={followersOpen}
        onClose={() => setFollowersOpen(false)}
        title="Followers"
        users={followers}
      />
    </>
  );
}

function CustomDialog({
  open,
  onClose,
  title,
  users,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  users: UserSimple[];
}) {
  const router = useRouter();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          bgcolor: "#121212",
          color: "#fff",
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          borderBottom: "1px solid #2f2f2f",
          fontWeight: "bold",
        }}
      >
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: 400, p: 0 }}>
        <List dense>
          {users.map((user) => (
            <ListItem
              key={user.id}
              sx={{ px: 2, cursor: "pointer" }}
              onClick={() => {
                router.push(`/${user.username}`);
                onClose();
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={getImageUrl(user.profilePicture) || "/favicon.ico"}
                  sx={{ border: "1px solid #2f2f2f" }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                    {user.name || user.username}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                  >
                    @{user.username}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
