import React from 'react';
import { FormControl, TextField, TextFieldProps } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';
import ErrorMessage from '/src/formmaster/ErrorMessage';

// Interface for props
interface Props {
  label: string; // Label for the text field
  inputProps?: TextFieldProps['InputProps']; // Input props for the text field
  name: string; // Name of the field
  control: any; // Form control from react-hook-form
  errors: any; // Form errors from react-hook-form
  required?: boolean; // Whether the field is required
}

const HookFormTextField: React.FC<Props> = ({ label, inputProps, name, control, errors, required = false }: Props) => {
  return (
    <FormControl fullWidth sx={{ mb: '1rem' }}>
      <Controller
        name={name}
        control={control}
        render={({ field }: { field: FieldValues }) => (
          <TextField
            {...field}
            {...addErrorIntoField(errors[name])}
            label={label}
            required={required}
            variant="filled"
            InputProps={inputProps}
            value={field.value || ''}
          />
        )}
      />
      {errors[name] ? <ErrorMessage message={errors[name].message} /> : null}
    </FormControl>
  );
};

export default HookFormTextField;
