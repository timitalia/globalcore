import React from 'react';
import { FormControl, FormControlLabel, FormLabel, RadioGroup, Radio } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';
import ErrorMessage from '/src/formmaster/ErrorMessage';

// Interface for props
interface Props {
  label?: string; // Label for the radio group
  groupLabelAlign?: 'left' | 'right' | 'center'; // Alignment of the group label
  name: string; // Name of the field
  control: any; // Form control from react-hook-form
  errors: any; // Form errors from react-hook-form
  options?: { value: string; text: string }[]; // Options for the radio group
  required?: boolean; // Whether the field is required
}

const HookFormRadioGroup: React.FC<Props> = ({
  label = '',
  groupLabelAlign = 'left',
  name,
  control,
  errors,
  options = [],
  required = false,
}: Props) => {
  return (
    <FormControl fullWidth>
      <FormLabel id={label} align={groupLabelAlign}>
        {label}
      </FormLabel>{' '}
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }: { field: { value: string; onChange: (value: string) => void } }) => (
          <RadioGroup value={value} onChange={(e) => onChange(e.target.value)} required={required} variant="filled" row={true}>
            {options.map((option) => (
              <FormControlLabel key={option.value} value={option.value} label={option.text} control={<Radio />} />
            ))}
          </RadioGroup>
        )}
      />
      {errors[name] ? <ErrorMessage message={errors[name].message} /> : null}
    </FormControl>
  );
};

export default HookFormRadioGroup;
