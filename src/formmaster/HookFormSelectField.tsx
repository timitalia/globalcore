import React from 'react';
import { FormControl, MenuItem, TextField } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';
import ErrorMessage from '/src/formmaster/ErrorMessage';

// Interface for props
interface Props {
  label: string; // Label for the select field
  name: string; // Name of the field
  control: any; // Form control from react-hook-form
  errors: any; // Form errors from react-hook-form
  options?: { value: string; text: string }[]; // Options for the select field
  textAlign?: 'left' | 'right' | 'center'; // Text alignment of the select field
  allowNoneOption?: boolean; // Whether to allow a "None" option
  noneOptionValue?: string; // Value of the "None" option
  required?: boolean; // Whether the field is required
}

const HookFormSelectField: React.FC<Props> = ({
  label,
  name,
  control,
  errors,
  options = [],
  textAlign = 'left',
  allowNoneOption = false,
  noneOptionValue = 'None',
  required = false,
}: Props) => {
  return (
    <FormControl fullWidth sx={{ mb: '1rem' }}>
      <Controller
        name={name}
        control={control}
        render={({ field }: { field: FieldValues }) => (
          <TextField
            align={textAlign}
            {...addErrorIntoField(errors[name])}
            {...field}
            required={required}
            select
            label={label}
            variant="filled"
            value={field.value || ''}
          >
            {allowNoneOption && (
              <MenuItem value="">
                <em>{noneOptionValue}</em>
              </MenuItem>
            )}
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.text}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      {errors[name] ? <ErrorMessage message={errors[name].message} /> : null}
    </FormControl>
  );
};

export default HookFormSelectField;
