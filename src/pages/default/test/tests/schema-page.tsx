import JsonEditor from '@/components/default/json-editor';
import { createDummySchema } from '@/schemas/dummy/dummy';
import { Box } from '@mui/material';

const SchemaPage = () => {
  const schema = createDummySchema();
  const mockdata = schema.generateMockData();
  console.log(schema.getTemplate());
  console.log(schema.schema, schema.schema.describe());
  return (
    <Box>
      <JsonEditor data={mockdata} />
    </Box>
  );
};

export default SchemaPage;
