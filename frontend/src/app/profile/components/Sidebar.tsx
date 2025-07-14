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
} from "@mui/material";

export default function Sidebar() {
  return (
    <Box>
      <ListItem
        sx={{
          justifyContent: "flex-start",
          px: 2,
          mb: 2,
          pointerEvents: "none",
        }}
        disableGutters
      >
        <ListItemIcon sx={{ minWidth: 36 }}>
          <AcUnit sx={{ fontSize: 32, color: "#1da1f2" }} />
        </ListItemIcon>
      </ListItem>

      <List>
        <SidebarItem icon={<Home />} label="Home" />
        <SidebarItem icon={<TravelExplore />} label="Explore" />
        <SidebarItem icon={<Notifications />} label="Notifications" />
        <SidebarItem icon={<MailOutline />} label="Messages" />
        <SidebarItem icon={<BookmarkBorder />} label="Bookmarks" />
        <SidebarItem icon={<Person />} label="Profile" />
        <SidebarItem icon={<Settings />} label="Settings" />{" "}
      </List>
    </Box>
  );
}

function SidebarItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <ListItemButton sx={{ borderRadius: 3, px: 2, py: 1, mb: 1 }}>
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
