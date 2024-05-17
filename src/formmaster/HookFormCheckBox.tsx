import React from 'react';
import { Checkbox, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';
import ErrorMessage from '/src/formmaster/ErrorMessage';

// Interface for props
interface Props {
  name: string; // Name of the field
  errors: any; // Form errors from react-hook-form
  control: any; // Form control from react-hook-form
  label: string; // Label for the checkbox
  groupLabel?: string; // Optional label for the group
  groupLabelAlign?: 'left' | 'right' | 'center'; // Alignment of the group label
  required?: boolean; // Whether the field is required
}

// Component for a checkbox form field using react-hook-form
const HookFormCheckBox: React.FC<Props> = ({
  name,
  errors,
  control,
  label,
  groupLabel = '',
  groupLabelAlign = 'left',
  required,
}: Props) => {
  return (
    <FormControl fullWidth>
      {/* Group label */}
      <FormLabel id="group-label" align={groupLabelAlign}>
        {groupLabel}
      </FormLabel>{' '}
      {/* Controller for checkbox field */}
      <Controller
        name={name}
        control={control}
        render={({ field }: { field: FieldValues }) => (
          <FormControlLabel control={<Checkbox {...field} required={required ? true : false} />} label={label} />
        )}
      />
      {/* Display error message if there are errors */}
      {errors[name] ? <ErrorMessage message={errors[name].message} /> : null}
    </FormControl>
  );
};

export default HookFormCheckBox;
