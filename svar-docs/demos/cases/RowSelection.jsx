import { useRef, useState, useCallback } from 'react';
import { Grid } from '../../src';
import { getData } from '../data';

export default function RowSelection() {
  const { data } = getData();

  const columns = [
    { id: 'id', width: 50 },
    { id: 'city', header: 'City', width: 160 },
    { id: 'firstName', header: 'First Name' },
    { id: 'lastName', header: 'Last Name' },
    { id: 'companyName', header: 'Company' },
  ];

  const apiRef = useRef(null);
  const [s, setS] = useState(0);
  const updateSelected = useCallback(() => {
    return setS(apiRef.current.getState().selectedRows);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h4>
        Click on any cell to select. Selected:{' '}
        {s.length ? s.join(', ') : 'none'}
      </h4>
      <div>
        <Grid
          data={data}
          columns={columns}
          ref={apiRef}
          onSelectRow={updateSelected}
        />
      </div>
    </div>
  );
}
