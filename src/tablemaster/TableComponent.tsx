import React, { useState, useEffect, useMemo } from 'react';
import Alert from '@mui/material/Alert';
import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleFiltersButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleGlobalFilterButton,
  MRT_GlobalFilterTextField,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, IconButton, LinearProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { MRT_Localization_DE } from 'material-react-table/locales/de';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { ThemeProvider, useTheme } from '@mui/material';
//import getTableTheme from '/src/tablemaster/TableTheme';

import TableDeleteDialog from './TableDeleteDialog';
import ToolBarChips from './ToolBarChips';
//import QuickFilterGate from './QuickFilterGate';
import TableDataCsvExport from './TableDataCsvExport';
import dayjs from 'dayjs';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileDownloadOffIcon from '@mui/icons-material/FileDownloadOff';
import TableEditDialog from './TableEditDialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Column {
  Header: string;
  accessor: string;
  // Define more properties as needed
}

interface QuickFilterState {
  [key: string]: string;
}

interface RowHighlightCondition {
  backgroundColor: string;
  conditions: Array<{ accessorKey: string; value: string }>;
  concatenation: 'OR' | 'AND';
}

interface Props {
  item_singular: string;
  item_plural: string;
  columns: Column[];
  columnVisibility?: Record<string, boolean>;
  createItemEndpointPath: string;
  updateItemEndpointPath: string;
  deleteItemEndpointPath: string;
  formfieldDefinitions: Record<string, any>;
  editDialogContent: React.ReactNode;
  deleteDialogContent: React.ReactNode;
  formValidationData: Record<string, any>;
  rowsPerPageOptions?: Array<number | { label: string; value: number }>;
  fetchDataEndpointPath: string;
  itemsDataKey?: string;
  allowedActions: {
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  showUpdateFormNavigateAndSaveNextButtons: boolean;
  showGlobalFilter?: boolean;
  totalChip?: React.ReactNode;
  avgChip?: React.ReactNode;
  avgPerDayChip?: React.ReactNode;
  avgPerMonthChip?: React.ReactNode;
  rowDensity?: number;
  customTableQuickFilterKey?: string;
  quickFilterStates?: QuickFilterState;
  rowHighlightCondition?: RowHighlightCondition;
  staticTableData?: any[]; // Define the type of staticTableData
  localisationEN?: boolean;
  skipDefaultTableHeadline?: boolean;
  titleColor?: string;
  secondHeadline?: string;
  api: AxiosInstance;
}

// Helperfunction to generate a unique reactQuery dataKey based on the api endpoint url
function generateReactQueryKey(str: string) {
  // Remove leading "/" if present
  if (str.charAt(0) === '/') {
    str = str.substr(1);
  }

  // Remove everything after the last "?"
  const lastQuestionMarkIndex = str.lastIndexOf('?');
  const lastIndex = Math.max(lastQuestionMarkIndex);
  if (lastIndex >= 0) {
    str = str.substr(0, lastIndex);
  }

  // Remove trailing "/" if present
  if (str.charAt(str.length - 1) === '/') {
    str = str.slice(0, -1);
  }

  // Replace all "/" and "-" characters with "_"
  str = str.replace(/[\/-]/g, '_');

  return str;
}

const TableComponent: React.FC<Props> = ({
  item_singular,
  item_plural,
  columns,
  columnVisibility,
  createItemEndpointPath,
  updateItemEndpointPath,
  deleteItemEndpointPath,
  formfieldDefinitions,
  editDialogContent,
  deleteDialogContent,
  formValidationData,
  rowsPerPageOptions,
  fetchDataEndpointPath,
  itemsDataKey,
  allowedActions,
  showUpdateFormNavigateAndSaveNextButtons,
  showGlobalFilter,
  totalChip,
  avgChip,
  avgPerDayChip,
  avgPerMonthChip,
  rowDensity,
  customTableQuickFilterKey,
  quickFilterStates,
  rowHighlightCondition,
  staticTableData,
  localisationEN,
  skipDefaultTableHeadline,
  titleColor,
  secondHeadline,
  api,
}) => {
  // Function definitions, state management, and other logic go here
  /* --------------------------------- Theming -------------------------------- */

  //const globalTheme = useTheme();
  //const tableTheme = useMemo(() => getTableTheme(globalTheme), [globalTheme]);

  /* --------------------- Check if to use staticTableData -------------------- */

  const isStaticTableData = null != staticTableData ? true : false;

  /* -------------------------------- API calls ------------------------------- */

  const getItems = async (isStaticTableData: boolean) => {
    let response: any = {};
    if (!isStaticTableData) {
      response = await api.get(`${fetchDataEndpointPath}`);
    }
    return response.data;
  };

  const createItem = async (item: any) => {
    return await api.post(`${createItemEndpointPath}`, item);
  };

  const updateItem = async (item: any, lowerCaseAttributes: boolean) => {
    const endpointPath = lowerCaseAttributes ? `${updateItemEndpointPath}${item.id}` : `${updateItemEndpointPath}${item.Id}`;
    return await api.put(endpointPath, item);
  };

  const deleteItem = async (item: any, lowerCaseAttributes: boolean) => {
    const endpointPath = lowerCaseAttributes ? `${deleteItemEndpointPath}${item.id}` : `${deleteItemEndpointPath}${item.Id}`;
    return await api.delete(endpointPath, item);
  };

  /* ------------------------------- React Query ------------------------------ */
  const queryClient = useQueryClient();
  const {
    isLoading,
    isFetching,
    isError,
    error,
    isFetched,
    data = [],
  } = useQuery({
    queryKey: [],
    queryFn: () => generateReactQueryKey(fetchDataEndpointPath), // Pass categoryId and serviceId to getEventDetails
    staleTime: Infinity,
  });

  const updateItemMutation = useMutation(
    (item: any) => updateItem(item, lowerCaseAttributes), // Pass lowerCaseAttributes directly
    {
      onSuccess: (response: any) => {
        // Invalidates cache and refetch
        queryClient.invalidateQueries(queryKey);
      },
    }
  );

  const createItemMutation = useMutation(createItem, {
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries(queryKey);
    },
  });

  const deleteItemMutation = useMutation(deleteItem, {
    onSuccess: () => {
      // Invalidates cache and refetch
      queryClient.invalidateQueries(queryKey);
    },
  });

  /* --------------------- Initial and filtered Tabledata --------------------- */

  let loadedTableData = isStaticTableData ? staticTableData : (itemsDataKey && data[itemsDataKey]) || data;
  const [paginationComplete, setPaginationComplete] = useState(false);
  const [rowsPerPageOpts, setRowsPerPageOpts] = useState<Array<number | { label: string; value: number }> | number[]>([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 0,
  });

  const handlePagination = () => {
    setPaginationComplete(false);

    let pageSize = loadedTableData.length;
    if (Array.isArray(rowsPerPageOptions) && rowsPerPageOptions.length > 1) {
      const lastOption = rowsPerPageOptions[rowsPerPageOptions.length - 1];
      if (typeof lastOption === 'string') {
        pageSize = loadedTableData.length;
        const label = lastOption;
        rowsPerPageOptions.pop();
        rowsPerPageOptions.push({ label, value: pageSize });
        setRowsPerPageOpts(rowsPerPageOptions);
      } else if (typeof lastOption === 'object' && lastOption !== null && 'label' in lastOption && 'value' in lastOption) {
        pageSize = lastOption.value;
        setRowsPerPageOpts(rowsPerPageOptions);
      } else {
        pageSize = lastOption;
        setRowsPerPageOpts(rowsPerPageOptions);
      }
    }
    setPagination((prevPagination) => ({
      ...prevPagination,
      pageSize,
    }));
    setPaginationComplete(true);
  };

  const [loadedTableDataLength, setLoadedTableDataLength] = useState(0);

  useEffect(() => {
    if (loadedTableData.length > 0) {
      setLoadedTableDataLength(loadedTableData.length);
    }
  }, [loadedTableData]);

  useEffect(() => {
    if (loadedTableDataLength > 0) {
      handlePagination();
    }
  }, [loadedTableDataLength]);

  /* -------------------------- Custom Table Filters -------------------------- */

  const customTableQuickFilter = customTableQuickFilterKey == null || customTableQuickFilterKey === '' ? false : true;

  /* ------------------------ Adapt columnFilterOptions ----------------------- */

  columns.forEach((column) => {
    // Remove empty columnFilterModeOptions
    if (column.columnFilterModeOptions && column.columnFilterModeOptions.length === 0) {
      delete column.columnFilterModeOptions;
    }

    // Remove undefined filterFn
    if (!column.filterFn) {
      delete column.filterFn;
    }

    // Format currency column
    if (column.currencyformat) {
      column.Cell = ({ cell }: any) => {
        const value = cell.getValue();
        if (typeof value === 'number') {
          return value.toLocaleString(column.currencyformat.locale, {
            style: 'currency',
            currency: column.currencyformat.currency,
            minimumFractionDigits: column.currencyformat.minDecimals,
            maximumFractionDigits: column.currencyformat.maxDecimals,
          });
        }
        return null; // Handle non-numeric values
      };
    }

    // Format date column
    if (column.dateformat) {
      column.Cell = ({ cell }: any) => {
        const value = cell.getValue();
        if (value) {
          return dayjs(value).locale('de').format(column.dateformat);
        }
        return null; // Handle empty values
      };
    }

    // Convert boolean to string
    if (column.boolean2String) {
      column.Cell = ({ cell }: any) => {
        const value = cell.getValue();
        return value != null ? value.toString() : null;
      };
    }

    // Set alignment for column
    if (column.align) {
      column.muiTableBodyCellProps = {
        align: column.align,
      };
    }
  });

  /* ----------------------------- RowHighlighting ---------------------------- */

  function checkRowHighlight(rowHighlightCondition: RowHighlightCondition, row: any) {
    console.info;
    if (!rowHighlightCondition || !rowHighlightCondition.conditions || rowHighlightCondition.conditions.length === 0) {
      return false;
    }

    const { concatenation, conditions } = rowHighlightCondition;

    return conditions.some((condition) => {
      const { accessorKey, value } = condition;
      const cellValue = row.original[accessorKey];

      if (value === 'EMPTY') {
        return !cellValue;
      } else if (concatenation === 'OR') {
        return conditions.some((c) => c.value === cellValue);
      } else if (concatenation === 'AND') {
        return conditions.every((c) => c.value === cellValue);
      }

      return false;
    });
  }

  /* ------------------- Allowed Actions & showGlobalFilter ------------------- */

  const allowedActionsValue = allowedActions ?? { create: false, edit: false, delete: false };
  const showGlobalFilterValue = showGlobalFilter == null || showGlobalFilter == false ? false : true;

  /* ---------------------------- CSV Export Toggle --------------------------- */

  const [isCsvExportEnabled, setCsvExportEnabled] = useState<boolean>(false);
  const toggleCsvExport = () => {
    setCsvExportEnabled((prevValue) => !prevValue);
  };

  /* -------------------------- EmptyItem generation -------------------------- */

  const emptyItem: any = {};
  Object.values(formfieldDefinitions).forEach((field: any) => {
    const fieldName = field.name;
    if (fieldName) {
      emptyItem[fieldName] = '';
    }
  });

  /* --------------------------------- States --------------------------------- */

  const [currentItem, setCurrentItem] = useState<any>(emptyItem);
  const [createMode, setCreateMode] = useState<any[]>([]);
  const [openDeleteDialog, setDeleteDialogOpen] = React.useState<boolean>(false);
  const [openEditDialog, setEditDialogOpen] = React.useState<boolean>(false);

  /* ----------------------------- Dialog handles ----------------------------- */

  const handleEditDialogOpen = (row: any, createMode: boolean) => {
    setCreateMode(createMode);
    if (createMode) {
      setCurrentItem(emptyItem);
    } else {
      setCurrentItem(row);
    }
    setEditDialogOpen(true);
  };

  const handleDeleteDialogOpen = (row: any) => {
    const item: any = import.meta.env.VITE_LOWER_CASE_ATTRIBUTES ? { id: row.id } : { Id: row.Id };
    Object.entries(emptyItem).forEach(([key, value]) => {
      item[key] = row[key];
    });
    setCurrentItem(item);
    setDeleteDialogOpen(true);
  };

  /* ----------------------- QuickFilterGate Connection ----------------------- */

  const [filteredData, setFilteredData] = useState<any>(null);

  /* ---------------------------- table definition ---------------------------- */

  const tableData =
    filteredData !== null ? filteredData : isStaticTableData ? staticTableData : (itemsDataKey && data[itemsDataKey]) || data;

  const table = useMaterialReactTable({
    data: tableData,
    columns,
    muiSkeletonProps: {
      animation: 'wave',
    },
    muiLinearProgressProps: {
      color: 'secondary',
    },
    renderTopToolbar: ({ table }: any) => {
      return (
        <>
          <Box sx={{ p: 0.8 }} bgcolor="#23282F">
            {secondHeadline ? (
              <Box display="flex" justifyContent="space-between">
                <Box display="flex" justifyContent="flex-start">
                  <h1 style={{ color: titleColor, marginTop: '0px', marginBottom: '3px', marginLeft: '6px' }}>{secondHeadline}</h1>
                </Box>
                <Box display="flex" justifyContent="flex-end">
                  {customTableQuickFilter && (
                    <QuickFilterGate
                      data={isStaticTableData ? staticTableData : (itemsDataKey && data[itemsDataKey]) || data}
                      setFilteredData={setFilteredData}
                      filterKey={customTableQuickFilterKey}
                      filterStates={quickFilterStates}
                    />
                  )}
                </Box>
              </Box>
            ) : (
              <Box display="flex" justifyContent="flex-end">
                {customTableQuickFilter && (
                  <QuickFilterGate
                    data={isStaticTableData ? staticTableData : (itemsDataKey && data[itemsDataKey]) || data}
                    setFilteredData={setFilteredData}
                    filterKey={customTableQuickFilterKey}
                    filterStates={quickFilterStates}
                  />
                )}
              </Box>
            )}
            <Box display="flex" flexDirection="column" bgcolor="#23282F">
              <Box display="flex" justifyContent="space-between">
                <ToolBarChips
                  table={table}
                  tableData={isStaticTableData ? staticTableData : (itemsDataKey && data[itemsDataKey]) || data}
                  totalChip={totalChip}
                  avgChip={avgChip}
                  avgPerDayChip={avgPerDayChip}
                  avgPerMonthChip={avgPerMonthChip}
                />

                {isCsvExportEnabled && (
                  <TableDataCsvExport
                    table={table}
                    isStaticTableData={isStaticTableData}
                    staticTableData={staticTableData}
                    data={data}
                    itemsDataKey={itemsDataKey}
                    localisationEN={localisationEN}
                  />
                )}
                <Box display="flex" justifyContent="flex-end">
                  <Box display="flex" justifyContent="flex-end">
                    <MRT_GlobalFilterTextField table={table} />
                    {!showGlobalFilterValue && <MRT_ToggleGlobalFilterButton table={table} />}
                  </Box>
                  <MRT_ToggleFiltersButton table={table} />
                  <MRT_ShowHideColumnsButton table={table} />
                  <MRT_ToggleDensePaddingButton table={table} />
                  <MRT_ToggleFullScreenButton table={table} />
                  <IconButton onClick={() => toggleCsvExport()}>
                    {isCsvExportEnabled ? <FileDownloadOffIcon /> : <FileDownloadIcon />}
                  </IconButton>
                  {allowedActionsValue.create && (
                    <IconButton color="primary" onClick={() => handleEditDialogOpen(null, true)}>
                      <AddIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
          {!isStaticTableData && isFetched && (
            <>
              <TableEditDialog
                openEditDialog={openEditDialog}
                setEditDialogOpen={setEditDialogOpen}
                handleEditDialogOpen={handleEditDialogOpen}
                handleItemCreate={createItemMutation.mutate}
                handleItemUpdate={updateItemMutation.mutate}
                currentItem={currentItem}
                setCurrentItem={setCurrentItem}
                createMode={createMode}
                emptyItem={emptyItem}
                item_singular={item_singular}
                formfieldDefinitions={formfieldDefinitions}
                formValidationData={formValidationData}
                table={table}
                showUpdateFormNavigateAndSaveNextButtons={showUpdateFormNavigateAndSaveNextButtons}
                fetchedData={data}
                dialogContent={editDialogContent}
              />
              <TableDeleteDialog
                openDeleteDialog={openDeleteDialog}
                setDeleteDialogOpen={setDeleteDialogOpen}
                currentItem={currentItem}
                handleItemDelete={deleteItemMutation.mutate}
                item_singular={item_singular}
                dialogContent={deleteDialogContent}
              />
            </>
          )}
        </>
      );
    },
    enableColumnOrdering: true,
    autoResetPageIndex: false,
    enablePagination: true,
    enableGlobalFilter: true,
    enableColumnFilterModes: true,
    initialState: {
      showGlobalFilterValue: showGlobalFilterValue,
      columnVisibility: columnVisibility === null ? {} : columnVisibility,
      density: rowDensity !== null && rowDensity !== undefined ? rowDensity : undefined,
    },
    state: {
      pagination,
      isLoading,
    },
    positionActionsColumn: 'last',
    globalFilterFn: 'contains',
    localization: localisationEN ? MRT_Localization_EN : MRT_Localization_DE,
    className: allowedActionsValue.edit || allowedActionsValue.delete ? '' : 'hide-actions-column',
    enableRowActions: !isStaticTableData && (allowedActionsValue.edit || allowedActionsValue.delete),
    onPaginationChange: setPagination,
    ...(!isLoading
      ? {
          muiPaginationProps: {
            rowsPerPageOptions: rowsPerPageOpts,
            showFirstButton: true,
            showLastButton: true,
          },
        }
      : {}),
    renderRowActions: ({ row }) => (
      <Box>
        {allowedActionsValue.edit && (
          <IconButton onClick={(e) => handleEditDialogOpen(row.original, false)}>
            <EditIcon color="primary" />
          </IconButton>
        )}
        {allowedActionsValue.delete && (
          <IconButton onClick={() => handleDeleteDialogOpen(row.original)}>
            <DeleteIcon color="primary" />
          </IconButton>
        )}
      </Box>
    ),
    muiTableBodyRowProps: ({ row }) => {
      if (checkRowHighlight(rowHighlightCondition, row)) {
        return {
          sx: {
            cursor: 'pointer',
            backgroundColor: rowHighlightCondition.backgroundColor,
            color: 'secondary',
          },
        };
      } else {
        return {};
      }
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Aktionen',
        size: 100,
      },
    },
  });

  return (
    <Box>
      {!skipDefaultTableHeadline && (titleColor ? <h1 style={{ color: titleColor }}>{item_plural}</h1> : <h1>{item_plural}</h1>)}
      {returnContent}
    </Box>
  );
};

export default TableComponent;
