import { useState, useRef, useMemo } from 'react';
import { getData, repeatColumns } from '../data';
import { Button } from '@svar-ui/react-core';
import { Grid } from '../../src/';
import './Styling.css';

export default function Styling() {
  const { data } = useMemo(() => getData(), []);
  const columns = useMemo(() => repeatColumns(50), []);

  const [cellStyle, setCellStyleState] = useState(undefined);
  const iRef = useRef(0);

  function setCellStyle() {
    const id = data[iRef.current].id;
    setCellStyleState(
      () => (row, col) =>
        row.id == id && col.id == 'lastName' ? 'wx-aEtQH7VY cellStyle' : '',
    );
    iRef.current = iRef.current == data.length - 1 ? 0 : iRef.current + 1;
  }

  return (
    <div style={{ padding: 20 }}>
      <p>
        <Button type="primary" onClick={() => setCellStyle()}>
          Set cell style
        </Button>
      </p>
      <div>
        <Grid
          data={data}
          columns={columns}
          cellStyle={cellStyle}
          rowStyle={(row) => (row.id == 12 ? 'wx-aEtQH7VY rowStyle' : '')}
          columnStyle={(col) =>
            col.id == 'city' ? 'wx-aEtQH7VY columnStyle' : ''
          }
          footer={true}
        />
      </div>
    </div>
  );
}
