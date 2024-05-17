import React, { useState, useEffect, useRef } from 'react';
import { FormControl, TextField } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';
import { addErrorIntoField } from '/src/utils/utils';
import ErrorMessage from '/src/formmaster/ErrorMessage';
import { NumericFormat, FormatInputValueFunction } from 'react-number-format';

// Interface for props
interface Props {
  label: string; // Label for the euro field
  control: any; // Form control from react-hook-form
  name: string; // Name of the field
  errors: any; // Form errors from react-hook-form
  required?: boolean; // Whether the field is required
  decimals?: number; // Number of decimal places
  suffix?: string; // Suffix for the euro field
}

// Custom numeric format component
const NumericFormatCustom = React.forwardRef<
  HTMLInputElement,
  {
    decimalScale: number;
    fixedDecimalScale: boolean;
    suffix: string | null | undefined;
    onChange: (event: React.ChangeEvent<HTMLInputElement>, value: any) => void;
  }
>(({ decimalScale, fixedDecimalScale, suffix, onChange, ...other }, ref) => {
  const handleChange: FormatInputValueFunction = (values) => {
    onChange({
      target: {
        name: other.name,
        value: typeof values.floatValue === 'undefined' || values.floatValue === null || values.floatValue === '' ? 0 : values.floatValue,
      },
    });
  };

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={handleChange}
      thousandSeparator="."
      decimalSeparator=","
      valueIsNumericString
      decimalScale={decimalScale}
      suffix={suffix}
      fixedDecimalScale={fixedDecimalScale}
    />
  );
});

// Euro Field Component
const HookFormEuroField: React.FC<Props> = ({ label, control, name, errors, required = false, decimals = 2, suffix = '' }: Props) => {
  const [value, setValue] = useState<string | number>();
  const decimalScale: number = decimals;
  const fixedDecimalScale: boolean = decimals > 0;
  const suffixValue: string = suffix;

  useEffect(() => {
    if (control._formValues && control._formValues[name]) {
      if (control._formValues[name] !== '') {
        setValue(control._formValues[name]);
      }
    } else {
      if (control._formValues[name] === 0) {
        setValue(control._formValues[name]);
      }
    }
  }, [control._formValues, name]);

  return (
    <FormControl fullWidth sx={{ mb: '1rem' }}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            {...addErrorIntoField(errors[name])}
            label={label}
            required={required}
            variant="filled"
            InputProps={{
              inputComponent: NumericFormatCustom as any,
            }}
            inputProps={{
              decimalScale: decimalScale,
              fixedDecimalScale: fixedDecimalScale,
              suffix: suffixValue,
            }}
          />
        )}
      />
      {errors[name] ? <ErrorMessage message={errors[name].message} /> : null}
    </FormControl>
  );
};

export default HookFormEuroField;
