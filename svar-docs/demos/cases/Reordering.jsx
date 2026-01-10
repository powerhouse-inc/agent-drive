import { useMemo } from 'react';
import { Grid } from '../../src';
import { repeatData, repeatColumns } from '../data';

const Reordering = () => {
  const rows = 100;
  const cols = 20;

  const data = useMemo(() => repeatData(rows, cols), [rows, cols]);

  const columns = useMemo(() => repeatColumns(cols), [cols]);

  const columnsWithDraggable = useMemo(() => {
    const colsArr = repeatColumns(cols);
    colsArr[0].draggable = true;
    return colsArr;
  }, [cols]);

  const columnsWithSelectiveDraggable = useMemo(() => {
    const colsArr = repeatColumns(cols);
    colsArr[0].draggable = (row) => row.id % 2 === 1;
    return colsArr;
  }, [cols]);

  return (
    <>
      <div style={{ padding: '20px' }}>
        <h4>Base reordering</h4>
        <div style={{ width: '800px', height: '400px' }}>
          <Grid data={data} columns={columns} reorder />
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <h4>Reordering with a drag handle</h4>
        <div style={{ width: '800px', height: '400px' }}>
          <Grid data={data} columns={columnsWithDraggable} footer reorder />
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <h4>
          Restrictive drag handlers (rows without drag handlers cannot be moved)
        </h4>
        <div style={{ width: '800px', height: '400px' }}>
          <Grid
            data={data}
            columns={columnsWithSelectiveDraggable}
            footer
            reorder
          />
        </div>
      </div>
    </>
  );
};

export default Reordering;
