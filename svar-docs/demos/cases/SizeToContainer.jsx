import { useState } from 'react';
import { Slider, Field, Checkbox } from '@svar-ui/react-core';
import { Grid } from '../../src';
import { getData, repeatColumns } from '../data';
import './SizeToContainer.css';

export default function SizeToContainer() {
  const { data, columns, flexibleColumns } = getData();

  const [w, setW] = useState(600);
  const [h, setH] = useState(320);
  const [psize, setPsize] = useState(false);

  return (
    <div style={{ padding: 20 }}>
      <h4>DataGrid adjusts to the container</h4>
      <Field>
        <Checkbox
          label="Fill screen"
          value={psize}
          onChange={({ value }) => setPsize(value)}
        />
      </Field>
      <div className="wx-5UQD6jk9 controls">
        {!psize && (
          <>
            <Slider
              label={`Container width: ${w}px`}
              min={200}
              max={800}
              value={w}
              onChange={({ value }) => setW(value)}
            />
            <Slider
              label={`Container height: ${h}px`}
              min={200}
              max={800}
              value={h}
              onChange={({ value }) => setH(value)}
            />
          </>
        )}
      </div>

      <h3>Columns with fixed widths</h3>
      <div
        className="wx-5UQD6jk9 container"
        style={
          psize
            ? { width: '100%', height: '50%' }
            : { width: `${w}px`, height: `${h}px` }
        }
      >
        <Grid data={data.slice(0, 15)} columns={columns} />
      </div>

      <h3>Columns with flexible widths</h3>
      <div
        className="wx-5UQD6jk9 container"
        style={
          psize
            ? { width: '100%', height: '50%' }
            : { width: `${w}px`, height: `${h}px` }
        }
      >
        <Grid data={data.slice(0, 15)} columns={flexibleColumns} />
      </div>

      <h3>A lot of columns</h3>
      <div
        className="wx-5UQD6jk9 container"
        style={
          psize
            ? { width: '100%', height: '50%' }
            : { width: `${w}px`, height: `${h}px` }
        }
      >
        <Grid data={data.slice(0, 15)} columns={repeatColumns(50)} />
      </div>
    </div>
  );
}
