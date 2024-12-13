import { FieldConfig } from '@/libs/forms';
import { merge } from 'lodash';
import * as Yup from 'yup';

export interface Schema {
  [key: string]: {
    required?: boolean;
    type?: string;
    minLength?: number;
  };
}

// export const extractSchemaLabels = (schema: Yup.ObjectSchema<any>) => {
//   const fields = schema.fields;
//   const result = Object.keys(fields).map((key) => ({
//     name: key,
//     label: fields[key].describe().label || key,
//   }));
//   return result;
// };

export const extractFieldDefinitionFromYupSchema = (
  schema: Yup.ObjectSchema<any>,
  fieldConfig?: { [key: string]: Partial<FieldConfig> }
): { [key: string]: FieldConfig } => {
  // Go through all fields and add them to the return schema.
  // Merge with fieldConfig if it exists.
  // If there are meta fields, also add them
  // If there are nested fields, also add them

  const result: { [key: string]: FieldConfig } = {};
  const extractFields = (schema: Yup.ObjectSchema<any>, basePath?: string) => {
    const fields = schema.fields;
    Object.keys(fields).forEach((key) => {
      const newKey = basePath ? `${basePath}.${key}` : key;
      const field = fields[key];
      const description = field.describe();
      const label = 'label' in description ? description.label : key;
      const defaultValue = 'default' in description ? description.default : undefined;
      const meta = 'meta' in description ? description.meta : {};
      const newField: FieldConfig = {
        name: newKey,
        label,
        type: description.type,
        default: defaultValue,
        ...meta,
      };

      if (field.describe().type === 'object') {
        extractFields(field as Yup.ObjectSchema<any>, newField.name);
      }
      result[newKey] = newField;
    });
  };
  extractFields(schema);
  const merged = merge({}, result, fieldConfig);
  return merged;
};

// const schemas = {
//   recipe: recipeYupSchema,
// };

// export const getYupSchema = (name: keyof typeof schemas) => {
//   const schema = {
//     ...schemas[name],
//   };
//   return schema;
// };
