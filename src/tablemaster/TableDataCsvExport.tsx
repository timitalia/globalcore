import React from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import Papa from 'papaparse';
import dayjs from 'dayjs';
import { isScreenSize } from '/src/utils/utils';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

interface TableDataCsvExportProps {
  table: any;
  isStaticTableData: boolean;
  staticTableData: any[];
  data: any;
  itemsDataKey: string;
  localisationEN: boolean;
}

const TableDataCsvExport: React.FC<TableDataCsvExportProps> = ({
  table,
  isStaticTableData,
  staticTableData,
  data,
  itemsDataKey,
  localisationEN,
}) => {
  const labelDisplayedData = localisationEN ? 'Displayed table data CSV' : 'Anzeige-Tabellendaten';
  const labelDisplayedData_short = localisationEN ? 'DTD CSV' : 'ATD';
  const labelCompleteData = localisationEN ? 'Complete table data csv' : 'Vollständige-Tabellendaten';
  const labelCompleteData_short = localisationEN ? 'CTD CSV' : 'VTD';
  const isMedium = isScreenSize('md');

  const generateCSV = (tableRows: any[], headers: string[]) => {
    const csv = Papa.unparse({
      fields: headers,
      data: tableRows,
    });

    const filename = `tabledata-${dayjs().format('YYMMDD-HHmmss')}.csv`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // fallback to webkit
        window.location.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
      }
    }
  };

  const getPurifiedRows = (rows: any[], headers: string[]) => {
    const purifiedRows = rows.map((row) => {
      const purifiedRow: { [key: string]: any } = {};
      headers.forEach((key) => {
        purifiedRow[key] = row.original[key];
      });
      return purifiedRow;
    });
    return purifiedRows;
  };

  const handleExportRows = () => {
    const rows = table.getRowModel().rowsById;
    const tableColumns = table.getVisibleFlatColumns();
    const invisibleColumnKeys = ['mrt-row-actions', 'mrt-row-selections'];
    const visibleColumns = tableColumns.filter((column) => {
      return !invisibleColumnKeys.includes(column.id) && column.getIsVisible();
    });

    const visibleColumnKeys = visibleColumns.map((column) => column.id);
    const rowsArray = Object.values(rows);
    const purifiedRows = getPurifiedRows(rowsArray, visibleColumnKeys);

    generateCSV(purifiedRows, visibleColumnKeys);
  };

  const handleExportData = () => {
    const rows = table.getRowModel().rowsById;
    const tableItemsData = isStaticTableData ? staticTableData : (itemsDataKey && data[itemsDataKey]) || data;
    //tabelColumns from fetched data
    if (tableItemsData.length > 0) {
      const tableItemsDataColumns = Object.keys(data[itemsDataKey][0]);
      const invisibleColumnKeys = ['mrt-row-actions', 'mrt-row-selections'];
      const csvHeaders = tableItemsDataColumns.filter((element) => !invisibleColumnKeys.includes(element));
      // This time the basis is the complete filteredData
      const rowsArray = Object.values(rows);
      const purifiedRows = getPurifiedRows(rowsArray, csvHeaders);
      generateCSV(purifiedRows, csvHeaders);
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      {isMedium ? (
        <Tooltip title={labelDisplayedData}>
          <Button
            size="small"
            onClick={() => handleExportRows()}
            startIcon={<FileDownloadIcon fontSize="inherit" />}
            variant="contained"
            style={{ marginRight: '5px', marginLeft: '5px' }}
          >
            {labelDisplayedData_short}
          </Button>
        </Tooltip>
      ) : (
        <Button
          size="small"
          onClick={() => handleExportRows()}
          startIcon={<FileDownloadIcon fontSize="inherit" />}
          variant="contained"
          style={{ marginRight: '5px', marginLeft: '5px' }}
        >
          {labelDisplayedData}
        </Button>
      )}

      {isMedium ? (
        <Tooltip title={labelCompleteData}>
          <Button
            size="small"
            onClick={() => handleExportData()}
            startIcon={<FileDownloadIcon fontSize="inherit" />}
            variant="contained"
            style={{ marginRight: '5px', marginLeft: '5px' }}
          >
            {labelCompleteData_short}
          </Button>
        </Tooltip>
      ) : (
        <Button
          size="small"
          onClick={() => handleExportData()}
          startIcon={<FileDownloadIcon fontSize="inherit" />}
          variant="contained"
          style={{ marginRight: '5px', marginLeft: '5px' }}
        >
          {labelCompleteData}
        </Button>
      )}
    </Box>
  );
};

export default TableDataCsvExport;
