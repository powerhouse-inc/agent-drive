import { useMemo, useState } from 'react';
import { getData } from '../data';
import { Grid } from '../../src';
import './TableHeaderFooterVertical.css';

function TableHeaderFooterVertical() {
  const initial = useMemo(() => {
    const result = getData();
    result.data.length = 5;
    return result;
  }, []);

  const [data] = useState(initial.data);
  const [columns] = useState(initial.columnsVertical);
  const [scolumns] = useState(initial.columnsSpansVertical);

  return (
    <div className="wx-v2lYrYIW demo" style={{ padding: '20px' }}>
      <div>
        <Grid data={data} columns={columns} footer={true} />
      </div>
      <div style={{ marginTop: '20px' }}>
        <Grid data={data} columns={scolumns} footer={true} />
      </div>
    </div>
  );
}

export default TableHeaderFooterVertical;
