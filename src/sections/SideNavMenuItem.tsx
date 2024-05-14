import React from "react";
import { ListItemButton, ListItemText, ListItem, ListItemIcon } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

interface SndSubMenuItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  setDrawerOpen: (state: boolean) => void; // Adjusted prop
}

const SndSubMenuItem: React.FC<SndSubMenuItemProps> = ({ to, label, icon, setDrawerOpen }) => {
  const toggleDrawer = () => {
    setDrawerOpen(false); // Close drawer on item click
  };

  const { pathname } = useLocation();
  const isActive = pathname === to;

  // Define the default color style
  const listItemTextStyle = {
    color: "#FFFFFF", // Default color
  };

  // Define the indent style
  const indentFromLeft = {
    pl: 4, // 4px left padding
  };

  return (
    <ListItem disablePadding>
      <Link to={to} style={{ textDecoration: "none", width: "100%" }} onClick={toggleDrawer}>
        {/* Pass the color and indent styles */}
        <ListItemButton selected={isActive} sx={indentFromLeft}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={label} sx={listItemTextStyle} />
        </ListItemButton>
      </Link>
    </ListItem>
  );
};

export default SndSubMenuItem;
