import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import React, { useState } from 'react';

interface DataTableProps {
  columns: {
    id: string;
    accessor: string;
    label: string;
    render?: (value: any, row: any, rowIndex: number) => any;
  }[];
  data: any[];
}

const DataTable = ({ columns, data }: DataTableProps) => {
  // State to manage sorting
  const [order, setOrder] = useState<'asc' | 'desc' | undefined>('asc'); // 'asc' or 'desc'
  const [orderBy, setOrderBy] = useState<string | null>(null); // column to sort by

  // Helper function to handle sorting logic
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Function to sort data based on the current sorting state
  const sortedData = React.useMemo(() => {
    if (orderBy === null) return data; // No sorting

    return [...data].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, orderBy, order]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>
                <TableSortLabel
                  active={orderBy === column.accessor}
                  direction={orderBy === column.accessor ? order : 'asc'}
                  onClick={() => handleRequestSort(column.accessor)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {column.render
                    ? column.render(row[column.accessor], row, rowIndex)
                    : row[column.accessor]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
