import useDataMutations from '@/libs/data-sources/use-data-mutations';
import useDataQuery from '@/libs/data-sources/use-data-query';
import { createDummySchema, Dummy } from '@/schemas/dummy/dummy';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid2 as Grid,
  Stack,
} from '@mui/material';
import SearchBar from '../filters/components/search-bar';
import useFilter from '../filters/use-filter';

interface DataSource {
  provider: string;
  queryKey: string;
}

// Examples1 - get item data from total dataset and load if not present:
//   const query = useDataQuery<Dummy[]>({
//     queryKey: [queryKey, 'hoE41IaLI46Wanq7ccmyr'],
//     queryFn: async ({ queryKey, client }) => {
//       console.log('QueryFn', queryKey, client);
//       const data = (await client.ensureQueryData({
//         queryKey: [queryKey[0]],
//         queryFn: datasource.getAll,
//       })) as Dummy[];
//       console.log(data, queryKey);
//       return data.filter((row) => row.id === queryKey[1]);
//     },
//     // subscribe: false,
//   });
// Example2: initial fetching
// const query = useDataQuery<Dummy[]>({
//   queryKey: [queryKey],
//   enabled: false, // disable initial fetching
//   subscribe: false, // disable subscription
// });

// const datasource = dataSources.dummy_ls;

const DataSourcesCard = ({ source }: { source: DataSource }) => {
  const { provider, queryKey } = source;
  const query = useDataQuery<Dummy[], { id: string; name: string; number: number }[]>({
    queryKey: [queryKey],
    select: (data: Dummy[] | Dummy) =>
      Array.isArray(data)
        ? (data?.map((row) => ({ id: row.id, name: row.name, number: row.number })) as Dummy[])
        : ({ id: data.id, name: data.name, number: data.number } as Dummy),
    // enabled: false,
    // subscribe: false,
  });
  const {
    add,
    update,
    set,
    delete: del,
  } = useDataMutations<Dummy>({ mutationKey: [queryKey], debug: true, resource: 'Dummy' });

  const selection = Array.isArray(query.data)
    ? query.data?.filter((_row, index) => index < 2)
    : query.data;
  const template = Array.isArray(query.data)
    ? (query.data?.[0] as Dummy)
    : (query.data as unknown as Dummy);

  return (
    <Card>
      <CardHeader title={`${provider}: ${queryKey}`} />
      <CardContent>
        Data:
        <pre>{JSON.stringify(selection, null, 2)}</pre>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={() => add.mutate(createDummySchema().generateMockData())}
        >
          Add
        </Button>
        <Button
          variant="contained"
          onClick={() => set.mutate({ ...template, number: (template?.number || 0) + 1 })}
        >
          Set
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (template) {
              update.mutate({ id: template.id, number: (template?.number || 0) + 1 });
            }
          }}
        >
          Update
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => del.mutate(query.data?.[0].id as string)}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          onClick={() => query.refetch()}
        >
          Refetch
        </Button>
      </CardActions>
    </Card>
  );
};

const sources = [
  { provider: 'LocalStorage', queryKey: 'dummy_ls_subscribe' },
  { provider: 'LocalStorage', queryKey: 'dummy_ls' },
  { provider: 'LocalStorage', queryKey: 'dummy_document' },
  { provider: 'BaseDataSource', queryKey: 'dummy_cache' },
];

const DataSourceTestPage = () => {
  const { data: filteredItems, ...filterOptions } = useFilter(sources, {
    initialSortField: 'name',
    initialSortDirection: 'asc',
    initialRowsPerPage: 24,
    // initialFilters: [
    //   {
    //     id: 'alternate',
    //     label: 'Alternate',
    //     type: 'boolean',
    //     value: null,
    //   },
    // ],
    // initialPage: 0,
    updateInitialData: true,
    searchableFields: ['provider', 'queryKey'],
    debounceTime: 100,
  });
  return (
    <Box>
      <Stack
        // spacing={2}
        mb={1}
      >
        <SearchBar filter={filterOptions} />
      </Stack>
      <Stack
        direction={'row'}
        alignItems={'flex-end'}
        justifyContent={'space-between'}
        sx={{ mb: 1 }}
      >
        <Box>
          {/* <SortOptions
            filter={filterOptions}
            options={sortOptions}
            muiFormControlProps={{ sx: { minWidth: 250 } }}
          /> */}
        </Box>
        <Box>
          {/* <BooleanFilter
            id="alternate"
            filterOptions={filterOptions}
          /> */}
        </Box>
      </Stack>
      <Grid
        container
        spacing={2}
      >
        {filteredItems.map((source) => (
          <Grid
            size={{ xs: 12, md: 6 }}
            key={source.queryKey}
          >
            <DataSourcesCard
              key={source.queryKey}
              source={source}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DataSourceTestPage;
