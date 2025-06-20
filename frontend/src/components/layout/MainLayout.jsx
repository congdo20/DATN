import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Box } from "@mui/material";

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <main style={{ flex: 1, marginTop: "64px", padding: "24px" }}>
        {children}
      </main>
      <Footer />
    </Box>
  );
};

export default MainLayout;
