import { useMemo } from 'react';
import { getData } from '../data';
import { Grid } from '../../src';

export default function AutoConfigColumns() {
  const { allData } = useMemo(() => getData(), []);
  const config = useMemo(() => ({ editor: 'text' }), []);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ height: 620, maxWidth: 800 }}>
        <Grid data={allData} autoConfig={config} />
      </div>
    </div>
  );
}
