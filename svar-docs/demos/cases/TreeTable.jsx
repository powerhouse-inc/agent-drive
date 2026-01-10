import { useRef } from 'react';
import { Button } from '@svar-ui/react-core';
import { getData } from '../data';
import { Grid } from '../../src/';
import './TreeTable.css';

const { treeData, treeColumns } = getData();

function TreeTable() {
  const api = useRef();

  function openAll() {
    api.current.exec('open-row', { id: 0, nested: true });
  }

  function closeAll() {
    api.current.exec('close-row', { id: 0, nested: true });
  }

  return (
    <div style={{ padding: '20px' }}>
      <div className="wx-ue8z24ft toolbar">
        <Button type="primary" onClick={() => openAll()}>
          Open all
        </Button>
        <Button type="primary" onClick={() => closeAll()}>
          Close all
        </Button>
      </div>
      <div>
        <Grid
          ref={api}
          tree={true}
          data={treeData}
          columns={treeColumns}
          footer={true}
        />
      </div>
    </div>
  );
}

export default TreeTable;
