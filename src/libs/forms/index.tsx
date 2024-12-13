import { AutocompleteProps, TextFieldProps } from '@mui/material';

export interface FieldConfig {
  id?: string;
  name: string;
  label?: string;
  translationKey?: string;
  type?: string; // TODO: limit types
  options?: any[];
  definition?: string;
  initialValue?: any;
  //render?: (config: FieldDefinitionConfig) => any;
  validation?: (value: any) => any; //Yup.AnySchema;
  default?: any;
  custom?: FieldOptions;
}

type MuiProps = {
  [key: `mui${string}Props`]: any;
};

export interface FieldOptions extends MuiProps {
  muiTextFieldProps?: TextFieldProps;
  muiAutoCompleteProps?: AutocompleteProps<any, any, any, any>;
  editMode?: boolean;
  debounce?: number;
  [key: string]: any;
}

export { default as CustomForm } from './custom-form';
export { default as useFormButton } from './use-form-button';
export { default as useFormField } from './use-form-field';
