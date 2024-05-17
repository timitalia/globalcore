import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';

interface TableDeleteDialogProps {
  openDeleteDialog: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleItemDelete: (item: any) => void;
  currentItem: any;
  item_singular: string;
  dialogContent: any; // Adjust the type according to the type of dialogContent
}

const TableDeleteDialog: React.FC<TableDeleteDialogProps> = ({
  openDeleteDialog,
  setDeleteDialogOpen,
  handleItemDelete,
  currentItem,
  item_singular,
  dialogContent,
}) => {
  const handleDelete = () => {
    handleItemDelete(currentItem);
    setDeleteDialogOpen(false);
  };

  // check if content is a function
  const renderDialogContent = typeof dialogContent === 'function' ? dialogContent(currentItem) : dialogContent;

  return (
    <Box>
      <Dialog open={openDeleteDialog} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{item_singular} löschen</DialogTitle>
        <DialogContent>{renderDialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Abbrechen</Button>
          <Button onClick={handleDelete}>Löschen</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableDeleteDialog;
