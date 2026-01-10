import { useMemo } from 'react';
import { getData } from '../data';
import { Grid } from '../../src/';

function BasicInit() {
  const { data, columns } = useMemo(() => getData(), []);

  return (
    <div style={{ padding: '20px' }}>
      <div>
        <Grid data={data} columns={columns} />
      </div>
    </div>
  );
}

export default BasicInit;
