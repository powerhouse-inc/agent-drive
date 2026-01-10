import { useState, useMemo, useRef, useCallback } from 'react';
import { getData } from '../data';
import { Grid, HeaderMenu } from '../../src/';
import './TableHeaderFooterSpans.css';

function TableHeaderFooterSpans() {
  const { data, columnsSpans } = useMemo(() => getData(), []);
  const [api, setApi] = useState(null);
  const apiRef = useRef(null);

  const apiCallbackRef = useCallback((instance) => {
    apiRef.current = instance;
    setApi(instance ?? null);
  }, []);

  return (
    <div className="wx-7x9QjG19 demo" style={{ padding: '20px' }}>
      <div>
        <HeaderMenu api={api}>
          <Grid
            data={data}
            columns={columnsSpans}
            footer={true}
            ref={apiCallbackRef}
          />
        </HeaderMenu>
      </div>
    </div>
  );
}

export default TableHeaderFooterSpans;
