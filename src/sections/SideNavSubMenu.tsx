import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

import Collapse from '@mui/material/Collapse';
import SideNavSubMenuItem from './SideNavSubMenuItem';

// Define the props for the SideNavSubMenu component
interface SideNavSubMenuProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode; // Modify to accept React nodes
}

const SideNavSubMenu: React.FC<SideNavSubMenuProps> = ({ label, icon, children }) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  // Filter the children to only include SideNavSubMenuItem components
  const filteredChildren = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && (child as React.ReactElement).type === SideNavSubMenuItem
  );

  return (
    <Box>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {filteredChildren.length > 0 ? (
            filteredChildren
          ) : (
            <ListItemButton disabled>
              <ListItemText primary="No items" />
            </ListItemButton>
          )}
        </List>
      </Collapse>
    </Box>
  );
};

export default SideNavSubMenu;
