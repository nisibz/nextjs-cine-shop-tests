"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material";
const roboto = Roboto({
  weight: ["100", "400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});
export default theme;
