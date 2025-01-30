import DataTable from '@/components/default/data-table';
import { createDummySchema, Dummy } from '@/schemas/dummy';
import { useMemo } from 'react';
import DefaultPage from '../DefaultPage';

const columns = [
  {
    id: 'name',
    accessor: 'name',
    label: 'Name',
  },
  {
    id: 'string',
    accessor: 'string',
    label: 'String',
  },
];

const FiltersPage = () => {
  const data = useMemo(() => createDummySchema().getMockData(20), []) as Dummy[];

  return (
    <DefaultPage>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <DataTable
        columns={columns}
        data={data}
      />
      {/* <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: Dummy) => (
              <TableRow key={row.name}>
                {columns.map((column) => (
                  <TableCell key={column.id}>{row[column.accessor]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </DefaultPage>
  );
};

export default FiltersPage;
