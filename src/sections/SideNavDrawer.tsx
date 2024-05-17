import React, { useEffect } from 'react';
import { Drawer } from '@mui/material';

interface SideNavDrawerProps {
  useStore: () => { drawerOpen: boolean; setDrawerOpen: (open: boolean) => void };
  SideMenu: React.ComponentType<any>;
}

const SideNavDrawer: React.FC<SideNavDrawerProps> = ({ useStore, SideMenu }) => {
  const { drawerOpen, setDrawerOpen } = useStore();

  useEffect(() => {}, [drawerOpen]);

  return (
    <>
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <SideMenu />
      </Drawer>
    </>
  );
};

export default SideNavDrawer;
