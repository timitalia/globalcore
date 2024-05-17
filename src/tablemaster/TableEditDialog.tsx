import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FormFieldsConverter from '/src/formmaster/FormFieldsConverter';

interface TableEditDialogProps {
  openEditDialog: boolean;
  setEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleItemUpdate: (data: any) => void;
  handleItemCreate: (data: any) => void;
  currentItem: any;
  setCurrentItem: React.Dispatch<React.SetStateAction<any>>;
  createMode: boolean;
  item_singular: string;
  formfieldDefinitions: any[];
  formValidationData: any;
  emptyItem: any;
  table: any;
  showUpdateFormNavigateAndSaveNextButtons: boolean;
  fetchedData: any;
  dialogContent: any;
}

const TableEditDialog: React.FC<TableEditDialogProps> = ({
  openEditDialog,
  setEditDialogOpen,
  handleItemUpdate,
  handleItemCreate,
  currentItem,
  setCurrentItem,
  createMode,
  item_singular,
  formfieldDefinitions,
  formValidationData,
  emptyItem,
  table,
  showUpdateFormNavigateAndSaveNextButtons,
  fetchedData,
  dialogContent,
}) => {
  /* ---------------------- Complete formfieldDefinitions --------------------- */

  const getOriginalObjects = (obj: any) => {
    const valuesArray = Object.values(obj);
    return valuesArray.map((item) => item.original);
  };

  const currentRows = getOriginalObjects(table.getRowModel().rowsById);
  formfieldDefinitions = addOptionsToFormFields(formfieldDefinitions, fetchedData);
  formfieldDefinitions = addRequiredFields(formfieldDefinitions, formValidationData);

  /* --------------------------- Yup FormValidation --------------------------- */

  const formValidation = yup.object().shape(formValidationData);

  /* ----------------------------- React From Hook ---------------------------- */

  const defaultValues = currentItem ? currentItem : {};

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(formValidation),
  });

  useEffect(() => {
    if (currentItem) {
      reset(currentItem);
    }
  }, [currentItem, reset]);

  /* ------------------------- Dialog Action Handlers ------------------------- */

  const handleDialogSave = (formData: any) => {
    if (createMode) {
      handleItemCreate(formData);
    } else {
      handleItemUpdate(formData);
    }
    handleDialogClose();
  };

  //const currentRows = table.getRowModel().getRowIds;

  const handleDialogSaveAndNext = (formData: any) => {
    const nextCurrentRow = import.meta.env.VITE_LOWER_CASE_ATTRIBUTES ? getNextCurrentRow(formData.id) : getNextCurrentRow(formData.Id);

    handleItemUpdate(formData);

    if (Object.keys(nextCurrentRow).length === 0) {
      handleDialogClose();
    } else {
      handleItemUpdate(formData);
      setCurrentItem(nextCurrentRow);
    }
  };

  const handleDialogNext = (formData: any) => {
    const nextCurrentRow = import.meta.env.VITE_LOWER_CASE_ATTRIBUTES
      ? getNextCurrentRow(formData.id, currentRows)
      : getNextCurrentRow(formData.Id, currentRows);
    if (Object.keys(nextCurrentRow).length === 0) {
      handleDialogClose();
    } else {
      setCurrentItem(nextCurrentRow);
    }
  };

  const handlePrevious = (formData: any) => {
    const previousCurrentRow = import.meta.env.VITE_LOWER_CASE_ATTRIBUTES
      ? getPrevious(formData.id, currentRows)
      : getPrevious(formData.Id, currentRows);
    if (Object.keys(previousCurrentRow).length === 0) {
      handleDialogClose();
    } else {
      setCurrentItem(previousCurrentRow);
    }
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setCurrentItem(emptyItem);
  };

  /* ------------------------- CurrentRows Navigation ------------------------- */

  const getNextCurrentRow = (id: string) => {
    // Find the index of the row with the given id in currentRows
    const currentIndex = import.meta.env.VITE_LOWER_CASE_ATTRIBUTES
      ? currentRows.findIndex((obj) => obj.id === id)
      : currentRows.findIndex((obj) => obj.Id === id);
    let nextCurrentRow = {};
    if (currentRows.length > 1 && currentIndex === currentRows.length - 1) {
      nextCurrentRow = currentRows[0];
    } else if (currentRows.length > 1 && currentIndex !== currentRows.length - 1) {
      nextCurrentRow = currentRows[currentIndex + 1];
    }
    return nextCurrentRow;
  };

  const getNextCurrentRow1 = (Id: string) => {
    // Find the index of the row with the given id in currentRows
    const currentIndex = import.meta.env.VITE_LOWER_CASE_ATTRIBUTES
      ? currentRows.findIndex((obj) => obj.id === id)
      : currentRows.findIndex((obj) => obj.Id === id);
    let nextCurrentRow = {};
    if (currentRows.length > 1 && currentIndex === currentRows.length - 1) {
      nextCurrentRow = currentRows[0];
    } else if (currentRows.length > 1 && currentIndex !== currentRows.length - 1) {
      nextCurrentRow = currentRows[currentIndex + 1];
    }
    return nextCurrentRow;
  };

  const getPrevious = (id: string, currentRows: any[]) => {
    // Find the index of the row with the given id in currentRows
    const currentIndex = import.meta.env.VITE_LOWER_CASE_ATTRIBUTES
      ? currentRows.findIndex((obj) => obj.id === id)
      : currentRows.findIndex((obj) => obj.Id === id);
    let previousCurrentRow = {};
    if (currentRows.length > 1 && currentIndex === 0) {
      previousCurrentRow = currentRows[currentRows.length - 1];
    } else if (currentRows.length > 1 && currentIndex !== 0) {
      previousCurrentRow = currentRows[currentIndex - 1];
    }
    return previousCurrentRow;
  };

  /* ----------------------- keyPress Dialog Navigation ----------------------- */

  useEffect(() => {
    const dialogFormKeyNavigation = (event: KeyboardEvent) => {
      if (openEditDialog && (event.key === 'Control' || event.key === 'Enter')) {
        document.getElementById('saveAndNextButton')?.click();
      }
      if ((openEditDialog && event.key === 'Alt') || event.key === 'ArrowDown') {
        document.getElementById('nextButton')?.click();
      }

      if (openEditDialog && event.key === 'ArrowUp') {
        document.getElementById('previousButton')?.click();
      }
    };
    window.addEventListener('keydown', dialogFormKeyNavigation);

    return () => {
      window.removeEventListener('keydown', dialogFormKeyNavigation);
    };
  }, [openEditDialog]);

  const renderDialogContent = typeof dialogContent === 'function' ? dialogContent(currentItem) : dialogContent;
  /* ----------------------------- Return content ----------------------------- */

  return (
    <Box>
      <Dialog open={openEditDialog} onClose={handleDialogClose}>
        <DialogTitle>{createMode ? item_singular + ' erstellen' : item_singular + ' bearbeiten'}</DialogTitle>
        <DialogContent sx={{ pt: '5px !important' }}>
          {renderDialogContent}
          <form>
            <FormFieldsConverter
              formfieldDefinitions={formfieldDefinitions}
              formValidationData={formValidationData}
              fetchedData={fetchedData}
              control={control}
              errors={errors}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Abbrechen</Button>
          <Button onClick={handleSubmit(handleDialogSave)}>{createMode ? 'Erstellen' : 'Speichern'}</Button>
          {createMode === false && (
            <Button
              id="saveAndNextButton"
              style={{ display: showUpdateFormNavigateAndSaveNextButtons ? 'block' : 'none' }}
              onClick={handleSubmit(handleDialogSaveAndNext)}
            >{`Speichern & Weiter`}</Button>
          )}
          {createMode === false && (
            <Button
              id="previousButton"
              style={{ display: showUpdateFormNavigateAndSaveNextButtons ? 'block' : 'none', height: '35px' }}
              onClick={handleSubmit(handlePrevious)}
            >
              <KeyboardArrowLeftIcon />
            </Button>
          )}
          {createMode === false && (
            <Button
              id="nextButton"
              style={{ display: showUpdateFormNavigateAndSaveNextButtons ? 'block' : 'none', height: '35px' }}
              onClick={handleSubmit(handleDialogNext)}
            >
              <KeyboardArrowRightIcon />
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableEditDialog;
