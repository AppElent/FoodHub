import { createDummySchema } from '@/schemas/dummy';
import DefaultPage from '../DefaultPage';

const SchemaPage = () => {
  const schema = createDummySchema();
  console.log(schema);
  const mockdata = schema.generateMockData();
  console.log(mockdata);
  return <DefaultPage></DefaultPage>;
};

export default SchemaPage;
