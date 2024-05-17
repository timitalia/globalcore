import React from 'react';
import { ListItemButton, ListItemText, ListItem, ListItemIcon } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

interface SideNavSubMenuItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  setDrawerOpen: (state: boolean) => void; // Adjusted prop
}

const SideNavSubMenuItem: React.FC<SideNavSubMenuItemProps> = ({ to, label, icon, setDrawerOpen }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  const toggleDrawer = () => {
    setDrawerOpen(false); // Close drawer on item click
  };

  const listItemTextStyle = {
    color: '#FFFFFF',
  };

  const indentFromLeft = {
    pl: 4,
  };

  return (
    <ListItem disablePadding>
      <Link to={to} style={{ textDecoration: 'none', width: '100%' }} onClick={toggleDrawer}>
        <ListItemButton selected={isActive} sx={indentFromLeft}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={label} sx={listItemTextStyle} />
        </ListItemButton>
      </Link>
    </ListItem>
  );
};

export default SideNavSubMenuItem;
