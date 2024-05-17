import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import dayjs, { Dayjs } from 'dayjs';

// Define an interface for the error field
interface ErrorField {
  error: boolean;
}

// Function to add an error into a field based on the provided boolean
export const addErrorIntoField = (errors: boolean): ErrorField => (errors ? { error: true } : { error: false });

// Regular expression for validating phone numbers
export const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

// Regular expression for validating passwords
export const pawdRegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

// Function to check if the current screen size matches the provided breakpoint
export const isScreenSize = (bp: 'xs' | 'sm' | 'md' | 'lg'): boolean => {
  const theme = useTheme();
  let currentScreenSize: 'xs' | 'sm' | 'md' | 'lg' = 'xs';

  // Update the screen size based on breakpoints
  if (useMediaQuery(theme.breakpoints.up('sm'))) {
    currentScreenSize = 'sm';
  }
  if (useMediaQuery(theme.breakpoints.up('md'))) {
    currentScreenSize = 'md';
  }
  if (useMediaQuery(theme.breakpoints.up('lg'))) {
    currentScreenSize = 'lg';
  }

  // Return true if the current screen size matches the provided breakpoint
  return currentScreenSize === bp;
};

// Function to check if the screen size is medium or larger
export const isMediumScreen = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up('md'));
};

// Function to check if the screen size is small or larger
export const isSmallScreen = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up('xs'));
};

// Function to check if the screen size is large or larger
export const isLargeScreen = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up('lg'));
};

// Function to format a number to Euro currency format
export const formatNumberToEuro = (number: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(number);
};

// Define an interface for table data
interface TableData {
  [key: string]: any;
}

// Define an interface for the result of transaction calculations
interface TransactionResult {
  days?: number;
  month?: number;
  oldestDate: Dayjs;
  youngestDate: Dayjs;
}

// Function to calculate the number of days between transactions
export const daysBetweenTransactions = (tableData: TableData[], dateKey: string, monthRounded: boolean): TransactionResult | null => {
  // Initialize oldest and youngest dates with the first entry
  let oldestDate = dayjs(tableData[0][dateKey]);
  let youngestDate = dayjs(tableData[0][dateKey]);

  // Iterate through the data to find the oldest and youngest dates
  for (let i = 1; i < tableData.length; i++) {
    const date = dayjs(tableData[i][dateKey]);
    if (date.isBefore(oldestDate)) {
      oldestDate = date;
    }
    if (date.isAfter(youngestDate)) {
      youngestDate = date;
    }
  }

  // Check if oldest date is greater than the youngest date (which should not happen)
  if (oldestDate.isAfter(youngestDate)) {
    console.error('oldestDate is greater than youngestDate');
    return null;
  }

  // Calculate the number of days between the dates
  let days = 0;
  if (!oldestDate.isSame(youngestDate, 'day')) {
    if (monthRounded) {
      oldestDate = oldestDate.startOf('month');
      youngestDate = youngestDate.endOf('month');
    }
    days = youngestDate.diff(oldestDate, 'day');
  }

  return {
    days,
    oldestDate,
    youngestDate,
  };
};

// Function to calculate the number of months between transactions
export const monthBetweenTransactions = (tableData: TableData[], dateKey: string): TransactionResult | null => {
  // Initialize oldest and youngest dates with the first entry
  let oldestDate = dayjs(tableData[0][dateKey]);
  let youngestDate = dayjs(tableData[0][dateKey]);

  // Iterate through the data to find the oldest and youngest dates
  for (let i = 1; i < tableData.length; i++) {
    const date = dayjs(tableData[i][dateKey]);
    if (date.isBefore(oldestDate)) {
      oldestDate = date;
    }
    if (date.isAfter(youngestDate)) {
      youngestDate = date;
    }
  }

  // Check if oldest date is greater than the youngest date (which should not happen)
  if (oldestDate.isAfter(youngestDate)) {
    console.error('oldestDate is greater than youngestDate');
    return null;
  }

  // Calculate the number of months between the dates
  const startOfMonth = oldestDate.startOf('month');
  const endOfMonth = youngestDate.endOf('month');
  const month = endOfMonth.diff(startOfMonth, 'month');

  return {
    month,
    oldestDate: startOfMonth,
    youngestDate: endOfMonth,
  };
};
