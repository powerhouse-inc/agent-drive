import { useState, useRef, useMemo, useCallback } from 'react';
import { Grid } from '../../src';
import { Button, Field, RadioButtonGroup } from '@svar-ui/react-core';
import { repeatData, repeatColumns } from '../data';
import './PrintWideGrid.css';

export default function PrintWideGrid() {
  const data = useMemo(() => repeatData(100), []);
  const columns = useMemo(() => repeatColumns(20), []);

  const [mode, setMode] = useState('portrait');
  const [paper, setPaper] = useState('a4');

  const modes = [
    { id: 'portrait', label: 'Portrait' },
    { id: 'landscape', label: 'Landscape' },
  ];
  const papers = [
    { id: 'a3', label: 'a3' },
    { id: 'a4', label: 'a4' },
    { id: 'letter', label: 'letter' },
  ];

  const api = useRef(null);

  const printGrid = useCallback(() => {
    if (api.current) {
      api.current.exec('print', { mode, paper });
    }
  }, [mode, paper]);

  return (
    <div className="wx-y7hmFYpS demo" style={{ padding: 20 }}>
      <div className="wx-y7hmFYpS config">
        <Field label="Mode" position="left" type="checkbox">
          <RadioButtonGroup
            options={modes}
            type="inline"
            value={mode}
            onChange={({ value }) => setMode(value)}
          />
        </Field>
        <Field label="Paper" position="left" type="checkbox">
          <RadioButtonGroup
            options={papers}
            type="inline"
            value={paper}
            onChange={({ value }) => setPaper(value)}
          />
        </Field>
      </div>
      <h4>Print grid</h4>
      <div>
        <Button onClick={printGrid} type="primary">
          Print Grid
        </Button>
      </div>
      <div style={{ height: 400, marginTop: 10 }}>
        <Grid ref={api} data={data} columns={columns} />
      </div>
    </div>
  );
}
