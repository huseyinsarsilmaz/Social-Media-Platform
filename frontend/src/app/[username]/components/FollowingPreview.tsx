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
  imageName
    ? `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}users/images/${imageName}`
    : "/favicon.ico";

export default function FollowingPreview({
  followings,
  followers,
}: {
  followings: UserSimple[];
  followers: UserSimple[];
}) {
  const [openDialog, setOpenDialog] = useState<
    "followers" | "followings" | null
  >(null);

  return (
    <Stack
      direction="row"
      spacing={4}
      sx={{ mt: 2, color: "rgba(255, 255, 255, 0.6)" }}
    >
      <FollowCount
        label="Followers"
        count={followers.length}
        onClick={() => setOpenDialog("followers")}
      />
      <FollowCount
        label="Following"
        count={followings.length}
        onClick={() => setOpenDialog("followings")}
      />

      <FollowListDialog
        open={openDialog === "followers"}
        onClose={() => setOpenDialog(null)}
        title="Followers"
        users={followers}
      />
      <FollowListDialog
        open={openDialog === "followings"}
        onClose={() => setOpenDialog(null)}
        title="Following"
        users={followings}
      />
    </Stack>
  );
}

function FollowCount({
  label,
  count,
  onClick,
}: {
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        "&:hover span": { textDecoration: "underline" },
      }}
    >
      <Typography component="span" fontWeight="bold" sx={{ color: "#fff" }}>
        {count}
      </Typography>{" "}
      {label}
    </Box>
  );
}

function FollowListDialog({
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
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: { bgcolor: "#121212", color: "#fff" },
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
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: 400, p: 0 }}>
        <List dense>
          {users.map((user) => (
            <FollowListItem key={user.id} user={user} onClick={onClose} />
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

function FollowListItem({
  user,
  onClick,
}: {
  user: UserSimple;
  onClick: () => void;
}) {
  const router = useRouter();

  return (
    <ListItem
      sx={{ px: 2, cursor: "pointer" }}
      onClick={() => {
        router.push(`/${user.username}`);
        onClick();
      }}
    >
      <ListItemAvatar>
        <Avatar
          src={getImageUrl(user.profilePicture)}
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
  );
}
