import JsonEditor from '@/components/default/json-editor';
import { createDummySchema } from '@/schemas/dummy';
import DefaultPage from '../DefaultPage';

const SchemaPage = () => {
  const schema = createDummySchema();
  const mockdata = schema.generateMockData();
  return (
    <DefaultPage>
      <JsonEditor data={mockdata} />
    </DefaultPage>
  );
};

export default SchemaPage;
