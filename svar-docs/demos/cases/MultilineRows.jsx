import { useRef, useCallback, useMemo } from 'react';
import { Button } from '@svar-ui/react-core';
import { repeatColumns, repeatData } from '../data';
import { Grid } from '../../src/';
import './MultilineRows.css';

function MultilineRows() {
  const api = useRef(null);

  const addRow = useCallback(() => {
    if (api.current) {
      api.current.exec('add-row', { row: {} });
    }
  }, []);

  const deleteRow = useCallback(() => {
    const id = api.current?.getState().selectedRows[0];
    if (id) {
      api.current.exec('delete-row', { id });
    }
  }, []);

  const data = useMemo(() => repeatData(60), []);
  const columns = useMemo(
    () =>
      repeatColumns(15).map((c) => ({
        ...c,
        resize: true,
        editor: 'text',
      })),
    [],
  );

  return (
    <>
      <div className="wx-BSVA8Eaw bar">
        <Button onClick={addRow} type="primary">
          Add row
        </Button>
        <Button onClick={deleteRow}>Delete Row</Button>
      </div>
      <div className="wx-BSVA8Eaw demo">
        <Grid
          ref={api}
          autoRowHeight
          data={data}
          columns={columns}
          footer={true}
          split={{ left: 2 }}
        />
      </div>
    </>
  );
}

export default MultilineRows;
