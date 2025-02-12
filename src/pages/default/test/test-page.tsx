import usePathRouter from '@/hooks/use-path-router';
import AuthTestPage from '@/libs/auth/auth-test-page';
import DataSourcesTestPage from '@/libs/data-sources/datasource-test-page';
import FiltersPage from '@/libs/filters/test-page';
import FormsTestPage from '@/libs/forms/forms-test-page';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid2 as Grid,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import DefaultPage from '../DefaultPage';
import FileUploadsTestPage from './tests/file-uploads';
import SchemaPage from './tests/schema-page';
import TranslationTestPage from './tests/translation-test-page';

const tests = [
  {
    id: 'schemas',
    title: 'Schemas',
    description: 'Schemas library',
    component: <SchemaPage />,
  },
  {
    id: 'filters',
    title: 'Filters',
    description: 'Filters library',
    component: <FiltersPage />,
  },
  {
    id: 'forms',
    title: 'Forms',
    description: 'Forms library',
    component: <FormsTestPage />,
  },
  {
    id: 'translations',
    title: 'Translations',
    description: 'Translations library',
    component: <TranslationTestPage />,
  },
  {
    id: 'auth-providers',
    title: 'Auth Providers',
    description: 'Auth Providers library',
    component: <AuthTestPage />,
  },
  {
    id: 'data-sources',
    title: 'Data Sources',
    description: 'Data Sources library',
    component: <DataSourcesTestPage />,
  },
  {
    id: 'file-uploads',
    title: 'File Uploads',
    description: 'File Uploads library',
    component: <FileUploadsTestPage />,
  },
];

const TestOverview = () => {
  const router = usePathRouter();
  return (
    <DefaultPage>
      <Grid
        container
        spacing={2}
      >
        {tests.map((test) => (
          <Grid
            key={test.id}
            size={4}
          >
            <Card>
              <CardHeader title={test.title} />
              <CardContent>
                <Typography>{test.description}</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  key={test.id}
                  onClick={() => router.push('testsDetail', { testId: test.id })}
                >
                  {test.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DefaultPage>
  );
};

const TestPage = () => {
  const params = useParams();

  const test = tests.find((t) => t.id === params.testId);

  if (!test) return <TestOverview />;

  const options = {
    testsDetail: {
      getLabel: () => test.title,
      options: _.sortBy(tests, 'title').map((t) => ({
        key: t.id,
        label: t.title,
      })),
    },
  };

  return (
    <DefaultPage options={options}>
      {test && test.component}
      {!test && <h1>Test Page</h1>}
    </DefaultPage>
  );
};

export default TestPage;
