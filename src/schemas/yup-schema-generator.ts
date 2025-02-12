import { useMemo } from 'react';
import * as Yup from 'yup';

interface YupSchemaGeneratorProps {
  yupSchema: Yup.ObjectSchema<any>;
  translate?: (key: string) => string | undefined;
}

const createYupSchemaGenerator = (props: YupSchemaGeneratorProps) => {
  const generate = () => {
    // yup stores schema fields in the `fields` property.
    // Note: this property is internal to yup and may change in future versions.
    const originalFields = props.yupSchema.fields;
    const newFields: Record<string, Yup.AnySchema> = {};

    for (const key in originalFields) {
      if (Object.prototype.hasOwnProperty.call(originalFields, key)) {
        const field = originalFields[key];
        // Check if the field is a schema (i.e., has a label method)
        if (
          field &&
          typeof field === 'object' &&
          'label' in field &&
          typeof field.label === 'function'
        ) {
          const description = typeof field.describe === 'function' ? field.describe() : {};
          const originalLabel =
            'label' in description && description.label !== undefined ? description.label : key;
          const newLabel = props.translate?.(key) || originalLabel;
          newFields[key] = field.label(newLabel);
          // console.log(key, newLabel, field, newFields[key]);
        } else {
          // For references or fields without label, just copy the field as-is.
          newFields[key] = field as Yup.AnySchema;
        }
      }
    }

    // Return a new yup object schema built from the updated fields.
    return Yup.object().shape(newFields);
  };

  return { generate };
};

export const useYupSchemaGenerator = ({ yupSchema, translate }: YupSchemaGeneratorProps) => {
  const generator = useMemo(() => {
    return createYupSchemaGenerator({ yupSchema, translate });
  }, [translate, yupSchema]);
  return generator;
};

export default createYupSchemaGenerator;
