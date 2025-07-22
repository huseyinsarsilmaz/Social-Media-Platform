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

// New prop: followings
interface Props {
  user: UserSimple;
  followings: UserSimple[];
  onEditClick: () => void;
}

const getImageUrl = (imageName: string | null) =>
  imageName ? `http://localhost:8080/api/users/images/${imageName}` : undefined;

export default function ProfileHeader({
  user,
  followings,
  onEditClick,
}: Props) {
  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 2, bgcolor: "#121212", borderRadius: 2, color: "#fff" }}
    >
      <Box sx={{ mt: 6, px: 2 }}>
        <CoverAndAvatar user={user} />
        <NameAndEdit user={user} onEditClick={onEditClick} />
        <Bio user={user} />
        <JoinDate user={user} />
        <FollowingPreview followings={followings} />
        <Divider sx={{ mt: 3, bgcolor: "#2f2f2f" }} />
      </Box>
    </Container>
  );
}

function CoverAndAvatar({ user }: { user: UserSimple }) {
  const coverUrl = getImageUrl(user.coverPicture);
  const profileUrl = getImageUrl(user.profilePicture) || "/favicon.ico";

  return (
    <Box
      sx={{
        height: 120,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        position: "relative",
        backgroundColor: coverUrl ? "transparent" : "#1da1f2",
        backgroundImage: coverUrl ? `url(${coverUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Avatar
        alt={user.name || user.username}
        src={profileUrl}
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

function NameAndEdit({
  user,
  onEditClick,
}: {
  user: UserSimple;
  onEditClick: () => void;
}) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mt: 6 }}
    >
      <Box>
        <Typography variant="h5" fontWeight="bold" component="h1" noWrap>
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

      <Button
        variant="outlined"
        sx={{
          borderColor: "#1da1f2",
          color: "#1da1f2",
          "&:hover": {
            borderColor: "#1a8cd8",
            backgroundColor: "rgba(29,161,242,0.1)",
          },
        }}
        onClick={onEditClick}
        aria-label="Edit profile"
      >
        Edit Profile
      </Button>
    </Stack>
  );
}

function Bio({ user }: { user: UserSimple }) {
  return (
    <Typography sx={{ mt: 1, color: "rgba(255, 255, 255, 0.6)" }}>
      {user.bio || "No bio available"}
    </Typography>
  );
}

function JoinDate({ user }: { user: UserSimple }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ mt: 1, color: "rgba(255, 255, 255, 0.6)", fontSize: 14 }}
    >
      <Stack direction="row" spacing={0.5} alignItems="center">
        <CalendarTodayIcon fontSize="small" />
        <Typography>
          Joined{" "}
          {user.createdAt
            ? format(parseISO(user.createdAt), "MMMM yyyy")
            : "unknown"}
        </Typography>
      </Stack>
    </Stack>
  );
}