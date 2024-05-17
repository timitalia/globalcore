import React, { useEffect, useState } from 'react';
import { FormControl, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import { addErrorIntoField } from '/src/utils/utils';
import ErrorMessage from '/src/formmaster/ErrorMessage';

// Interface for props
interface Props {
  label: string; // Label for the date picker
  control: any; // Form control from react-hook-form
  name: string; // Name of the field
  errors: any; // Form errors from react-hook-form
  required?: boolean; // Whether the field is required
  dateFormat: string; // Date format
}

// Component for a date picker form field using react-hook-form
const HookFormDatePicker: React.FC<Props> = ({ label, control, name, errors, required, dateFormat }: Props) => {
  const [value, setValue] = useState<Dayjs | null>(dayjs(control._formValues[name]));

  useEffect(() => {
    // Set initial value based on control form values
    if (control._formValues && control._formValues[name]) {
      if (control._formValues[name] === null || control._formValues[name].length === 0) {
        setValue(null);
      } else {
        setValue(dayjs(control._formValues[name]).format(dateFormat));
      }
    } else {
      setValue(null);
    }

    // Convert empty string to null for better handling
    if (control._formValues[name] === '') {
      control._formValues[name] = null;
    }
  }, [control._formValues[name]]);

  return (
    <FormControl fullWidth sx={{ mb: '1rem' }}>
      {/* Controller for date picker field */}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
            <DatePicker
              {...field}
              {...addErrorIntoField(errors[name])}
              label={label}
              format={dateFormat}
              value={dayjs(value, 'YYYY-MM-DD')}
              variant="filled"
              // Update value and form control on change
              onChange={(newValue) => {
                setValue(newValue);
                field.onChange(newValue === 'YYYY-MM-DD' || newValue === null ? null : dayjs(newValue).format('YYYY-MM-DD'));
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        )}
      />
      {/* Display error message if there are errors */}
      {errors[name] ? <ErrorMessage message={errors[name].message} /> : null}
    </FormControl>
  );
};

export default HookFormDatePicker;
