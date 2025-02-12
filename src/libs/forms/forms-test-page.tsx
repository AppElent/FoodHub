import { CustomForm } from '@/libs/forms';
import FormGrid from '@/libs/forms/components/FormGrid';
import JsonTextField from '@/libs/forms/components/JsonTextField';
import useCustomFormik from '@/libs/forms/use-custom-formik';
import { createDummySchema, dummyYupSchema } from '@/schemas/dummy/dummy';
import { Box } from '@mui/material';
import { useMemo } from 'react';

const FormsTestPage = () => {
  const dummySchema = useMemo(() => createDummySchema(), []);
  const formik = useCustomFormik({
    initialValues: dummySchema.generateMockData(),
    validationSchema: dummyYupSchema,
    onSubmit: async (values) => {
      console.log('Submitting', values);
    },
  });

  const items = useMemo(() => {
    const fieldDefinitions = dummySchema.getFieldDefinitions();
    return Object.keys(fieldDefinitions).map((key) => ({
      fieldDefinition: fieldDefinitions[key],
      size: 6,
    }));
  }, [dummySchema]);

  return (
    <Box>
      <CustomForm formik={formik}>
        <FormGrid items={items} />
        <JsonTextField />
      </CustomForm>
    </Box>
  );
};

export default FormsTestPage;
