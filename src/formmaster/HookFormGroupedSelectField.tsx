import React, { forwardRef } from 'react';
import { FormControl, MenuItem, Select, ListSubheader, InputLabel } from '@mui/material';
import { Controller, FieldValues } from 'react-hook-form';
import { addErrorIntoField } from '/src/utils/utils';
import ErrorMessage from '/src/formmaster/ErrorMessage';

interface GroupedOption {
  label: string;
  options: { value: string; text: string }[];
}

interface Props {
  label: string;
  name: string;
  control: any;
  errors: any;
  groupedOptions: GroupedOption[];
  textAlign?: 'left' | 'center' | 'right';
  allowNoneOption?: boolean;
  noneOptionValue?: string;
  required?: boolean;
}

const HookFormGroupedSelectField = forwardRef<HTMLSelectElement, Props>(
  (
    {
      label,
      name,
      control,
      errors,
      groupedOptions,
      textAlign = 'left',
      allowNoneOption = false,
      noneOptionValue = 'None',
      required = false,
    },
    ref
  ) => {
    const showNoneOption = allowNoneOption;

    const menuItems = [];
    if (showNoneOption) {
      menuItems.push(
        <MenuItem key="none" value="">
          <em>{noneOptionValue}</em>
        </MenuItem>
      );
    }

    if (groupedOptions) {
      groupedOptions.forEach((group) => {
        menuItems.push(<ListSubheader key={group.label}>{group.label}</ListSubheader>);
        group.options.forEach((option) => {
          menuItems.push(
            <MenuItem key={option.value} value={option.value}>
              {option.text}
            </MenuItem>
          );
        });
      });
    }

    return (
      <FormControl variant="filled" fullWidth sx={{ mb: '1rem' }}>
        <InputLabel htmlFor="grouped-select">{label}</InputLabel>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              id="grouped-select"
              ref={ref}
              align={textAlign}
              {...addErrorIntoField(errors[name])}
              {...field}
              required={required}
              variant="filled"
              value={field.value != null ? field.value : ''}
            >
              {menuItems}
            </Select>
          )}
        />
        {errors[name] ? <ErrorMessage message={errors[name].message} /> : null}
      </FormControl>
    );
  }
);

export default HookFormGroupedSelectField;
