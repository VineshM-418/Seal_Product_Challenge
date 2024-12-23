import * as React from 'react';
import { Cell, Column, Table2 } from '@blueprintjs/table';

interface OpviaTableProps {
  columns: { columnName: string; columnType: string; columnId: string }[];
  dummyTableData: { [key: string]: number };
}

const OpviaTable: React.FC<OpviaTableProps> = ({ columns, dummyTableData }) => {
  const getSparseRefFromIndexes = (
    rowIndex: number,
    columnIndex: number,
  ): string => `${columnIndex}-${rowIndex}`;

  const cellRenderer = (rowIndex: number, columnIndex: number) => {
    const sparsePosition = getSparseRefFromIndexes(rowIndex, columnIndex);
    const value = dummyTableData[sparsePosition] !== undefined ? dummyTableData[sparsePosition] : '';
    return <Cell>{String(value)}</Cell>;
  };

  const cols = columns.map((column) => (
    <Column
      key={`${column.columnId}`}
      cellRenderer={cellRenderer}
      name={column.columnName}
    />
  ));

  return (
    <Table2 defaultRowHeight={35} numRows={95}>
      {cols}
    </Table2>
  );
};

export default OpviaTable;
