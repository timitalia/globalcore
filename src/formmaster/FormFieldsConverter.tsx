import React from 'react';
import HookFormTextField from '/src/formmaster/HookFormTextField';
import HookFormSelectField from '/src/formmaster/HookFormSelectField';
import HookFormRadioGroup from '/src/formmaster/HookFormRadioGroup';
import HookFormDatePicker from '/src/formmaster/HookFormDatePicker';
import HookFormNumberField from '/src/formmaster/HookFormNumberField';
import HookFormGroupedSelectField from '/src/formmaster/HookFormGroupedSelectField';

import { Box } from '@mui/material';

// Interface for form field definition
interface FormFieldDefinition {
  type: string;
  name: string;
  label: string;
  options?: Array<any>;
  groupedOptions?: Array<any>;
  optionValueField?: string;
  optionDisplayField?: string;
  decimals?: number;
  suffix?: string;
  [key: string]: any;
}

// Interface for props
interface Props {
  formfieldDefinitions: FormFieldDefinition[];
  control: any; // Form control from react-hook-form
  errors: any; // Form errors from react-hook-form
}

// Component for converting form field definitions to respective form components
function FormFieldsConverter({ formfieldDefinitions, control, errors }: Props) {
  return (
    <>
      {formfieldDefinitions.map((definition, index) => {
        const { type, name, label, options, groupedOptions, optionValueField, optionDisplayField, decimals, suffix, ...rest } = definition;
        // Render respective form component based on type
        switch (type) {
          case 'HookFormTextField':
            return <HookFormTextField key={name} control={control} name={name} label={label} errors={errors} {...rest} />;
          case 'HookFormNumberField':
            return (
              <HookFormNumberField
                key={name}
                control={control}
                name={name}
                label={label}
                decimals={decimals}
                suffix={suffix}
                errors={errors}
                {...rest}
              />
            );
          case 'HookFormDatePicker':
            return <HookFormDatePicker key={name} control={control} name={name} label={label} errors={errors} {...rest} />;
          case 'HookFormSelectField':
            return (
              <HookFormSelectField key={name} control={control} name={name} label={label} options={options} errors={errors} {...rest} />
            );
          case 'HookFormGroupedSelectField':
            return (
              <HookFormGroupedSelectField
                key={name}
                control={control}
                name={name}
                label={label}
                groupedOptions={groupedOptions}
                errors={errors}
                {...rest}
              />
            );
          case 'HookFormRadioGroup':
            return (
              <HookFormRadioGroup
                key={name}
                control={control}
                name={name}
                label={label}
                optionValueField={optionValueField}
                optionDisplayField={optionDisplayField}
                options={options}
                errors={errors}
                {...rest}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}

export default FormFieldsConverter;
