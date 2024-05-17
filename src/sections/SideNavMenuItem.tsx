import React from 'react';
import { ListItemButton, ListItemText, ListItem, ListItemIcon } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

interface SideNavMenuItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  setDrawerOpen: (state: boolean) => void;
  listItemTextClass?: string; // Optional CSS class for ListItemText
}

const SideNavMenuItem: React.FC<SideNavMenuItemProps> = ({ to, label, icon, setDrawerOpen, listItemTextClass }) => {
  const toggleDrawer = () => {
    setDrawerOpen(false); // Close drawer on item click
  };

  const { pathname } = useLocation();
  const isActive = pathname === to;

  // Define the default color style
  const defaultListItemTextStyle = {
    color: '#FFFFFF', // Default color
  };

  // Define the indent style
  const indentFromLeft = {
    pl: 2, // 4px left padding
  };

  return (
    <ListItem disablePadding>
      <Link to={to} style={{ textDecoration: 'none', width: '100%' }} onClick={toggleDrawer}>
        <ListItemButton selected={isActive} sx={indentFromLeft}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText
            primary={label}
            className={listItemTextClass} // Apply the passed listItemTextClass if provided
            sx={!listItemTextClass ? defaultListItemTextStyle : {}} // Apply default style only if no listItemTextClass is provided
          />
        </ListItemButton>
      </Link>
    </ListItem>
  );
};

export default SideNavMenuItem;
