import { useRef, useState } from 'react';
import { Grid } from '../../src';
import { getData } from '../data';

const { data } = getData();

const columns = [
  { id: 'id', width: 50 },
  { id: 'city', header: 'City', width: 160 },
  { id: 'firstName', header: 'First Name' },
  { id: 'lastName', header: 'Last Name' },
  { id: 'companyName', header: 'Company' },
];

export default function RowMultiSelection() {
  const api = useRef(null);
  const [s, setS] = useState([]);

  const updateSelected = () => setS(api.current.getState().selectedRows);

  return (
    <div style={{ padding: '20px' }}>
      <h4>
        Click cells using Ctrl/Shift keys. Selected:{' '}
        {s.length ? s.join(', ') : 'none'}
      </h4>
      <div>
        <Grid
          data={data}
          columns={columns}
          multiselect={true}
          ref={api}
          onSelectRow={updateSelected}
        />
      </div>
    </div>
  );
}
