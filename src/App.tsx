import { Button, Dialog, Classes, InputGroup } from '@blueprintjs/core';
import React, { useState } from 'react';
import './App.css';
import OpviaTable from './OpviaTable';
import { dummyTableData as initialDummyTableData } from './data/dummyData';

const App: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [equation, setEquation] = useState<string>('');
  const [columns, setColumns] = useState([
    { columnName: 'Time', columnType: 'time', columnId: 'time_col' },
    { columnName: 'Cell Density (Cell Count/Litre)', columnType: 'data', columnId: 'var_col_1' },
    { columnName: 'Volume (Litres)', columnType: 'data', columnId: 'var_col_2' },
  ]);
  const [dummyTableData, setDummyTableData] = useState(initialDummyTableData);

  const parseAndEvaluateEquation = (equation: string, data: { [key: string]: number }, rowIndex: number): number => {
    const columnMapping: { [key: string]: number } = {};
    columns.forEach((col, index) => {
      columnMapping[`c${index + 1}`] = data[`${index}-${rowIndex}`] || 0;
    });

    const replacedEquation = equation.replace(/c\d+/g, (match) => {
      return columnMapping[match].toString();
    });

    console.log(`Evaluating equation for row ${rowIndex}: ${replacedEquation}`);

    try {
      // Use Function constructor to safely evaluate the expression
      return new Function(`return ${replacedEquation}`)();
    } catch (error) {
      console.error("Error evaluating equation:", error, `Equation: ${replacedEquation}`);
      return NaN;
    }
  };

  const handleAddColumn = () => {
    const newColumnId = `var_col_${columns.length + 1}`;
    const newColumn = { columnName: equation, columnType: 'data', columnId: newColumnId };

    const newTableData = { ...dummyTableData };

    for (let rowIndex = 0; rowIndex < 95; rowIndex++) {
      const result = parseAndEvaluateEquation(equation, dummyTableData, rowIndex);
      newTableData[`${columns.length}-${rowIndex}`] = result;
    }

    setColumns([...columns, newColumn]);
    setDummyTableData(newTableData);
    setIsDialogOpen(false);
  };

  return (
    <div className="App">
      <div style={{ height: 50 }}></div>
      <div style={{ paddingBottom: 10 }} className={Classes.TEXT_LARGE}>
        This is an empty template with the blueprintjs table installed and
        working with some dummy data. You can use this as your starting off
        point.
      </div>

      <div>
        Please carefully read the instructions in the readme on github{' '}
        <a href="https://github.com/opvia/column-cals-interview">here.</a>
      </div>
      <div style={{ padding: 75 }}>
        <Button onClick={() => setIsDialogOpen(true)}>Add Column</Button>
        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Enter Equation"
        >
          <div className={Classes.DIALOG_BODY}>
            <InputGroup
              placeholder="Enter equation (e.g., c1 * c2)"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
            />
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button onClick={handleAddColumn} intent="primary">
                Add Column
              </Button>
            </div>
          </div>
        </Dialog>
        <OpviaTable columns={columns} dummyTableData={dummyTableData} />
      </div>
    </div>
  );
};

export default App;
