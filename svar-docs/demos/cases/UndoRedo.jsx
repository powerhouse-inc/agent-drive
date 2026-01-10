import { useState, useEffect, useMemo } from 'react';
import { Button } from '@svar-ui/react-core';
import { getData } from '../data';
import { Grid, HeaderMenu, ContextMenu } from '../../src';
import './UndoRedo.css';

import { en } from '@svar-ui/core-locales';
import { Locale } from '@svar-ui/react-core';

function UndoRedo() {
  const { data } = useMemo(() => getData(), []);

  const [api, setApi] = useState(null);

  const historyStore = useMemo(
    () => (api ? api.getReactiveState()?.history : null),
    [api],
  );
  const [historyValue, setHistoryValue] = useState(undefined);

  useEffect(() => {
    if (!historyStore) {
      setHistoryValue(undefined);
      return;
    }
    const unsubscribe = historyStore.subscribe((v) => {
      setHistoryValue(v);
    });
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [historyStore]);

  const columns = useMemo(() => {
    const cols = [
      { id: 'id', width: 50 },
      {
        id: 'firstName',
        header: 'First Name',
        footer: 'First Name',
        editor: 'text',
        width: 150,
      },
      {
        id: 'lastName',
        header: 'Last Name',
        footer: 'Last Name',
        editor: 'text',
        width: 150,
      },
      {
        id: 'email',
        header: { text: 'Email', collapsible: true },
        footer: 'Email',
      },
      {
        id: 'companyName',
        header: { text: 'Company', collapsible: true },
        footer: 'Company',
      },
      { id: 'city', header: 'City' },
      { id: 'stars', header: 'Stars' },
    ];
    cols.forEach((c) => (c.resize = true));
    return cols;
  }, []);

  function handleUndo(apiInstance) {
    apiInstance.exec('undo');
  }
  function handleRedo(apiInstance) {
    apiInstance.exec('redo');
  }

  const undoDisabled = !!historyStore && !historyValue?.undo;
  const redoDisabled = !!historyStore && !historyValue?.redo;

  return (
    <div style={{ padding: '20px' }}>
      <div className="wx-7yK1MxW8 buttons" style={{ margin: '20px 0' }}>
        <Button
          type="primary"
          onClick={() => handleUndo(api)}
          disabled={undoDisabled}
        >
          Undo
        </Button>
        <Button
          type="primary"
          onClick={() => handleRedo(api)}
          disabled={redoDisabled}
        >
          Redo
        </Button>
      </div>
      <div>
        <Locale words={en} optional={true}>
          <ContextMenu api={api}>
            <HeaderMenu api={api}>
              <Grid data={data} columns={columns} init={setApi} undo reorder />
            </HeaderMenu>
          </ContextMenu>
        </Locale>
      </div>
    </div>
  );
}

export default UndoRedo;
