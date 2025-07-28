"use client";

import {
  AcUnit,
  Home,
  Person,
  Settings,
  TravelExplore,
  Notifications,
  MailOutline,
  BookmarkBorder,
} from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface SidebarProps {
  onPostOpen: () => void;
  username: string | null;
}

export default function Sidebar({ onPostOpen, username }: SidebarProps) {
  const router = useRouter();

  const sidebarItems = useMemo(
    () => [
      { label: "Home", icon: <Home />, path: "/home" },
      { label: "Explore", icon: <TravelExplore /> },
      { label: "Notifications", icon: <Notifications /> },
      { label: "Messages", icon: <MailOutline /> },
      { label: "Bookmarks", icon: <BookmarkBorder /> },
      {
        label: "Profile",
        icon: <Person />,
        path: username ? `/${username}` : "",
      },
      { label: "Settings", icon: <Settings /> },
    ],
    [username]
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100%"
    >
      <Box>
        <ListItem
          sx={{ justifyContent: "flex-start", px: 2, mb: 2, cursor: "pointer" }}
          disableGutters
          onClick={() => router.push("/home")}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <AcUnit sx={{ fontSize: 32, color: "#1da1f2" }} />
          </ListItemIcon>
        </ListItem>

        <List>
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              onClick={item.path ? () => router.push(item.path!) : undefined}
            />
          ))}

          <Box px={2} pt={1} pb={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={onPostOpen}
              sx={{
                bgcolor: "#fff",
                color: "#000",
                fontWeight: "bold",
                borderRadius: 9999,
                textTransform: "none",
                fontSize: 16,
                py: 1.2,
                "&:hover": {
                  bgcolor: "#e6e6e6",
                },
              }}
            >
              Post
            </Button>
          </Box>
        </List>
      </Box>
    </Box>
  );
}

function SidebarItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <ListItemButton
      onClick={onClick}
      sx={{ borderRadius: 3, px: 2, py: 1, mb: 1 }}
    >
      <ListItemIcon sx={{ color: "#fff", minWidth: 36 }}>{icon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography sx={{ color: "#fff", fontWeight: 500 }}>
            {label}
          </Typography>
        }
      />
    </ListItemButton>
  );
}
