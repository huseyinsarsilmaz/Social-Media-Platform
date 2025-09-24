import { Box, Typography, Paper, Stack, InputBase } from "@mui/material";

export default function Trending() {
  const trends = [
    { title: "Trending #1", posts: 12 },
    { title: "Trending #2", posts: 35 },
    { title: "Trending #3", posts: 7 },
  ];

  return (
    <Box>
      {/* Search bar placeholder */}
      <Box
        sx={{
          bgcolor: "#121212",
          borderRadius: 9999,
          px: 2,
          py: 1,
          mb: 3,
          display: "flex",
          alignItems: "center",
          color: "gray",
          fontSize: 14,
          userSelect: "none",
        }}
      >
        Search
      </Box>

      {/* Entire trending container with dim border */}
      <Box
        sx={{
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#000",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            p: 2,
            borderBottom: "1px solid rgba(255,255,255,0.15)",
            fontWeight: "bold",
          }}
        >
          What's happening
        </Typography>

        {trends.map(({ title, posts }, idx) => (
          <Paper
            key={idx}
            sx={{
              bgcolor: "black",
              color: "white",
              px: 2,
              py: 1.5,
              cursor: "pointer",
              "&:hover": { bgcolor: "#222" },
              borderBottom:
                idx !== trends.length - 1
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "none",
            }}
            elevation={0}
          >
            <Stack direction="column" spacing={0.3}>
              <Typography fontWeight={600}>{title}</Typography>
              <Typography variant="caption" color="white" sx={{ opacity: 0.7 }}>
                {posts} posts
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
