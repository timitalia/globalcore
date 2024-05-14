import React from "react";
import { ListItemButton, ListItemText, ListItem, ListItemIcon } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

interface SideNavSubMenuItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  useStore: () => { drawerOpen: boolean; setDrawerOpen: (open: boolean) => void };
  colorStyle?: React.CSSProperties; // Prop to accept the style object for color
}

const SideNavSubMenuItem: React.FC<SideNavSubMenuItemProps> = ({ to, label, icon, useStore, colorStyle }) => {
  const { drawerOpen, setDrawerOpen } = useStore();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const { pathname } = useLocation();
  const isActive = pathname === to;

  const listItemTextStyle = {
    color: "#FFFFFF", // Default color
    ...colorStyle, // Passed color style
  };

  const indentFromLeft = {
    pl: 4, // 4px left padding
  };

  return (
    <ListItem disablePadding>
      <Link to={to} style={{ textDecoration: "none", width: "100%" }} onClick={toggleDrawer}>
        <ListItemButton selected={isActive} sx={indentFromLeft}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={label} sx={listItemTextStyle} />
        </ListItemButton>
      </Link>
    </ListItem>
  );
};

export default SideNavSubMenuItem;
