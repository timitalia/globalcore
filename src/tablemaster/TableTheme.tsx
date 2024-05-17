import { createTheme } from '@mui/material';

interface GlobalTheme {
  palette: {
    mode: string,
    primary: string,
    tableComponent: {
      background: string,
    },
  };
}

const getTableTheme = (globalTheme: GlobalTheme) => {
  return createTheme({
    palette: {
      mode: globalTheme.palette.mode,
      primary: globalTheme.palette.primary,
      info: {
        main: 'rgb(255,122,0)',
      },
      background: {
        default: globalTheme.palette.mode === 'light' ? 'rgb(254,255,244)' : globalTheme.palette.tableComponent.background,
      },
    },
  });
};

export default getTableTheme;
