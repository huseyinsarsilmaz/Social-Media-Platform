"use client";

import { Box, Container, Stack } from "@mui/material";
import React from "react";

export default function ThreeColumnLayout({
  left,
  center,
  right,
}: {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Stack direction="row" spacing={2}>
        <Box flex={1} maxWidth={280}>
          {left}
        </Box>
        <Box flex={2.5} minWidth={0}>
          {center}
        </Box>
        <Box
          flex={1.5}
          maxWidth={300}
          sx={{ display: { xs: "none", md: "block" } }}
        >
          {right}
        </Box>
      </Stack>
    </Container>
  );
}
