import { useMemo, useRef, useCallback } from 'react';
import { Button } from '@svar-ui/react-core';
import { Grid } from '../../src';
import { repeatData, repeatColumns } from '../data';

export default function ScrollTable() {
  const data = useMemo(() => repeatData(1000), []);
  const columns = useMemo(() => repeatColumns(100), []);

  const api = useRef(null);

  const doScroll = useCallback((row, column) => {
    api.current.exec('scroll', { row, column });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          paddingBottom: '20px',
          display: 'flex',
          flexDirection: 'columns',
          gap: '20px',
        }}
      >
        <Button type="primary" onClick={() => doScroll(data[999].id)}>
          Scroll to the last row
        </Button>
        <Button type="primary" onClick={() => doScroll(null, columns[99].id)}>
          Scroll to the last column
        </Button>
        <Button
          type="primary"
          onClick={() => doScroll(data[0].id, columns[1].id)}
        >
          Scroll to the first row and column
        </Button>
      </div>
      <div style={{ width: '1000px', height: '600px' }}>
        <Grid ref={api} data={data} columns={columns} split={{ left: 1 }} />
      </div>
    </div>
  );
}
