import React from "react";
import Paper, { PaperProps } from "@mui/material/Paper";
import { Theme } from "@mui/material/styles";

interface CustomPaperProps extends PaperProps {
  theme: Theme;
  fullheight?: boolean;
  padding?: number;
  backgroundColor?: string;
}

const CustomPaper: React.FC<CustomPaperProps> = ({ theme, fullheight, padding, backgroundColor, children, ...other }) => {
  const getBackgroundColor = (theme: Theme, color?: string) => {
    if (color) {
      switch (color) {
        case "primary":
        case "secondary":
        case "error":
        case "warning":
        case "info":
        case "success":
          return theme.palette[color].main;
        default:
          // Treat color as a regular CSS color string value
          return color;
      }
    } else {
      // If no backgroundColor prop is provided, apply default based on theme mode
      return theme.palette.mode === "dark" ? theme.palette.background.default : theme.palette.background.paper;
    }
  };

  return (
    <Paper
      sx={{
        backgroundColor: getBackgroundColor(theme, backgroundColor),
        ...theme.typography.body2,
        padding: theme.spacing(padding || 0),
        textAlign: "center",
        color: theme.palette.text.secondary,
        height: fullheight ? "100% !important" : "auto",
      }}
      {...other}
    >
      {children}
    </Paper>
  );
};

export default CustomPaper;
