"use client";

import {
  Avatar,
  Box,
  Button,
  Stack,
  Typography,
  Divider,
  Container,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { format, parseISO } from "date-fns";
import { UserSimple } from "@/interface/interfaces";
import FollowingPreview from "./FollowingPreview";

interface Props {
  user: UserSimple;
  followings: UserSimple[];
  followers: UserSimple[];
  onEditClick: () => void;
  isOwnUser: boolean;
}

const getImageUrl = (name: string | null) =>
  name ? `http://localhost:8080/api/users/images/${name}` : undefined;

export default function ProfileHeader({
  user,
  followings,
  followers,
  onEditClick,
  isOwnUser,
}: Props) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 2,
        bgcolor: "#121212",
        borderRadius: 2,
        color: "#fff",
        px: 2,
        pb: 3,
      }}
    >
      <Box sx={{ mt: 6 }}>
        <CoverSection user={user} />
        <HeaderRow
          user={user}
          onEditClick={onEditClick}
          isOwnUser={isOwnUser}
        />
        <UserBio bio={user.bio} />
        <JoinDate date={user.createdAt} />
        <FollowingPreview followings={followings} followers={followers} />
        <Divider sx={{ mt: 3, bgcolor: "#2f2f2f" }} />
      </Box>
    </Container>
  );
}

function CoverSection({ user }: { user: UserSimple }) {
  const coverUrl = getImageUrl(user.coverPicture);
  const profileUrl = getImageUrl(user.profilePicture) || "/favicon.ico";

  return (
    <Box
      sx={{
        height: 120,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        position: "relative",
        background: coverUrl
          ? `url(${coverUrl}) center/cover no-repeat`
          : "#1da1f2",
      }}
    >
      <Avatar
        src={profileUrl}
        alt={user.name || user.username}
        sx={{
          width: 96,
          height: 96,
          border: "4px solid #121212",
          position: "absolute",
          bottom: -48,
          left: 16,
        }}
      />
    </Box>
  );
}

function HeaderRow({
  user,
  onEditClick,
  isOwnUser,
}: {
  user: UserSimple;
  onEditClick: () => void;
  isOwnUser: boolean;
}) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mt: 6 }}
    >
      <Box>
        <Typography variant="h5" fontWeight="bold" noWrap>
          {user.name || user.username}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
          noWrap
        >
          @{user.username || "unknown"}
        </Typography>
      </Box>
      {isOwnUser && (
        <Button
          variant="outlined"
          onClick={onEditClick}
          aria-label="Edit profile"
          sx={{
            borderColor: "#1da1f2",
            color: "#1da1f2",
            "&:hover": {
              borderColor: "#1a8cd8",
              backgroundColor: "rgba(29,161,242,0.1)",
            },
          }}
        >
          Edit Profile
        </Button>
      )}
    </Stack>
  );
}

function UserBio({ bio }: { bio?: string | null }) {
  return (
    <Typography sx={{ mt: 1, color: "rgba(255, 255, 255, 0.6)" }}>
      {bio || "No bio available"}
    </Typography>
  );
}

function JoinDate({ date }: { date?: string | null }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{ mt: 1, color: "rgba(255, 255, 255, 0.6)", fontSize: 14 }}
    >
      <CalendarTodayIcon fontSize="small" />
      <Typography>
        Joined {date ? format(parseISO(date), "MMMM yyyy") : "unknown"}
      </Typography>
    </Stack>
  );
}
