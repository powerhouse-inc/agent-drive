import { useState } from 'react';
import { Grid } from '../../src';
import OverlayComponent from '../custom/Overlay.jsx';
import { getData } from '../data';

function Overlay() {
  const { columns, data } = getData();

  const [showOverlay, setShowOverlay] = useState(true);

  function showData({ show }) {
    if (show) setShowOverlay(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h4>Overlay as a text</h4>
      <div>
        <Grid
          data={data.slice(0, 5)}
          columns={columns}
          overlay={'Loading...'}
          footer={true}
        />
      </div>
      <h4>Overlay as a component</h4>
      <div>
        <Grid
          data={data}
          columns={columns}
          overlay={showOverlay ? OverlayComponent : null}
          footer={true}
          onOverlayButtonClick={showData}
        />
      </div>
    </div>
  );
}

export default Overlay;
