import React from '@react';
import { Box, Typography, TypographyProps } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

// Interface for props
interface Props {
  message: string; // Error message to display
}

// Component for displaying error message
const ErrorMessage: React.FC<Props> = ({ message }: Props) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        mt: '6px',
      }}
    >
      {/* Error icon */}
      <ErrorIcon color="error" sx={{ width: '20px' }} />
      {/* Error message */}
      <Typography color="error.main" variant="span" fontSize="14px">
        {message}
      </Typography>
    </Box>
  );
};

export default ErrorMessage;
