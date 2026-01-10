import { useMemo } from 'react';
import { getData } from '../data';
import { Grid } from '../../src';

function CollapsibleColumns() {
  const { data, allData, collapsibleColumns } = useMemo(() => getData(), []);

  return (
    <>
      <div className="wx-TXaI4LvZ demo" style={{ padding: '20px' }}>
        <div style={{ height: '510px' }}>
          <Grid data={allData} columns={collapsibleColumns()} footer={true} />
        </div>
      </div>

      <div className="wx-TXaI4LvZ demo" style={{ padding: '20px' }}>
        <div>
          <Grid data={data} columns={collapsibleColumns('first')} />
        </div>
      </div>
    </>
  );
}

export default CollapsibleColumns;
