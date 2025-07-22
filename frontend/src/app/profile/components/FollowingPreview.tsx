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
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { UserSimple } from "@/interface/interfaces";

const getImageUrl = (imageName: string | null) =>
  imageName ? `http://localhost:8080/api/users/images/${imageName}` : undefined;

export default function FollowingPreview({
  followings,
}: {
  followings: UserSimple[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        fontWeight="bold"
        sx={{
          color: "#fff",
          cursor: "pointer",
          "&:hover": { textDecoration: "underline" },
        }}
        onClick={() => setOpen(true)}
      >
        Following: {followings.length}
      </Typography>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Following
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ maxHeight: 400, p: 0 }}>
          <List dense>
            {followings.map((user) => (
              <ListItem key={user.id} sx={{ px: 2 }}>
                <ListItemAvatar>
                  <Avatar
                    src={getImageUrl(user.profilePicture) || "/favicon.ico"}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography fontWeight="bold">
                      {user.name || user.username}
                    </Typography>
                  }
                  secondary={`@${user.username}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
