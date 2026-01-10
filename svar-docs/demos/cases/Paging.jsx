import { useState, useEffect, useMemo } from 'react';
import { Pager } from '@svar-ui/react-core';
import { Grid } from '../../src';
import { getData } from '../data';

export default function Paging() {
  const { allData, columns } = useMemo(() => getData(), []);
  const [data, setData] = useState(() => allData.slice(0, 8));

  function setPage(ev) {
    const { from, to } = ev;
    setData(allData.slice(from, to));
  }

  useEffect(() => {
    setPage({ from: 0, to: 8 });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Pager total={allData.length} pageSize={8} onChange={setPage} />
      <div>
        <Grid data={data} columns={columns} />
      </div>
    </div>
  );
}
