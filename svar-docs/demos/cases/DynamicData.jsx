import { useState, useEffect, useRef, useCallback, useContext } from 'react';

import { Slider, Button } from '@svar-ui/react-core';
import { Grid } from '../../src';
import { repeatData, repeatColumns } from '../data';
import { timer, timerEnd } from '../custom/timers';

import { context } from '@svar-ui/react-core';

function DynamicData() {
  const helpers = useContext(context.helpers);

  const [data, setData] = useState([]);
  const rawDataRef = useRef([]);
  const [columns, setColumns] = useState([]);

  const [stats, setStats] = useState(null);
  const [counter, setCounter] = useState(1);
  const [rowCount, setRowCount] = useState(1000);
  const [columnCount, setColumnCount] = useState(100);
  const [requestRange, setRequestRange] = useState({ start: 0, end: 0 });

  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const requestRangeRef = useRef(requestRange);
  useEffect(() => {
    requestRangeRef.current = requestRange;
  }, [requestRange]);

  const genRef = useRef(0);

  function genAndLoad() {
    timer('gen');
    setStats(null);
    rawDataRef.current = repeatData(+rowCount);
    setColumns(repeatColumns(+columnCount));
    setCounter((c) => c + 1);
    const gen = timerEnd('gen');
    genRef.current = gen;

    timer('render');
  }

  useEffect(() => {
    genAndLoad();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      const render = timerEnd('render');
      const full = genRef.current + render;
      setStats({ gen: genRef.current, render, full });
    }, 1);
    return () => clearTimeout(id);
  }, [counter]);

  function dataProvider(ev) {
    const { row } = ev;

    if (row.start)
      helpers.showNotice({
        text: `Request data: ${row.start} - ${row.end}`,
      });
    if (row) {
      setData(rawDataRef.current.slice(row.start, row.end));
      setRequestRange(row);
    }
  }

  const init = useCallback((api) => {
    api.on('move-item', (ev) => {
      const { id, target, mode } = ev;
      const index = rawDataRef.current.findIndex((el) => el.id === id);
      const targetIndex = rawDataRef.current.findIndex(
        (el) => el.id === target,
      );
      rawDataRef.current.splice(
        mode === 'before' ? targetIndex : targetIndex + 1,
        0,
        rawDataRef.current.splice(index, 1)[0],
      );

      if (dataRef.current.findIndex((el) => el.id === id) === -1) {
        const r = requestRangeRef.current;
        setData(rawDataRef.current.slice(r.start, r.end));
      }
    });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h4>Load data in portions during scroll</h4>

      <div style={{ width: '320px', paddingBottom: '20px' }}>
        <Slider
          label={`Rows: ${rowCount}`}
          min={2}
          max={200000}
          value={rowCount}
          onChange={({ value }) => setRowCount(value)}
        />
      </div>
      <div style={{ width: '320px', paddingBottom: '20px' }}>
        <Slider
          label={`Columns: ${columnCount}`}
          min={2}
          max={20000}
          value={columnCount}
          onChange={({ value }) => setColumnCount(value)}
        />
      </div>
      <div style={{ width: '320px', paddingBottom: '20px' }}>
        <Button type="primary" onClick={genAndLoad}>
          Generate data and load
        </Button>
      </div>
      <div style={{ width: '1000px', height: '600px' }}>
        <Grid
          key={counter}
          init={init}
          data={data}
          columns={columns}
          dynamic={{ rowCount, columnCount }}
          onRequestData={dataProvider}
          reorder
        />
      </div>
      {stats ? (
        <pre>
          {rowCount} rows, {columnCount} columns, {rowCount * columnCount} cells
          dataset generation: {stats.gen}ms dataset rendering: {stats.render}ms
        </pre>
      ) : null}
    </div>
  );
}

export default DynamicData;
