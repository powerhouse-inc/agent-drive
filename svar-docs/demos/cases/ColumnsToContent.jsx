import { useMemo, useRef, useCallback } from 'react';
import { Grid } from '../../src';
import { getData } from '../data';

export default function ColumnsToContent() {
  const { data, treeData, treeColumns } = useMemo(() => {
    const res = getData();
    delete res.treeColumns[0].flexgrow;
    return res;
  }, []);

  const columns = useMemo(
    () => [
      { id: 'id', width: 50 },
      { id: 'firstName', header: 'First Name' },
      { id: 'lastName', header: 'Last Name', editor: 'text' },
      { id: 'email', header: 'Email', editor: 'text' },
      {
        id: 'companyName',
        header: 'Company - long column name could be here',
        editor: 'text',
      },
      {
        id: 'street',
        header: 'Street',
        template: (v) => v + ' street',
      },
    ],
    [],
  );

  const api1Ref = useRef(null);
  const api2Ref = useRef(null);

  const resizeColumns = useCallback(() => {
    const api1 = api1Ref.current;
    api1.exec('resize-column', { id: 'email', auto: 'data' });
    api1.exec('resize-column', { id: 'lastName', auto: 'header' });
    api1.exec('resize-column', {
      id: 'companyName',
      auto: true,
      maxRows: 20,
    });
    api1.exec('resize-column', { id: 'street', auto: true });
  }, []);

  const resizeTreeColumns = useCallback(() => {
    const api2 = api2Ref.current;
    api2.exec('resize-column', { id: 'lastName', auto: 'data' });
    api2.exec('resize-column', { id: 'firstName', auto: 'header' });
    api2.exec('resize-column', { id: 'city', auto: true });
  }, []);

  const init = useCallback(
    (api) => {
      api1Ref.current = api;
      resizeColumns();
    },
    [resizeColumns],
  );

  const treeInit = useCallback(
    (api) => {
      api2Ref.current = api;
      resizeTreeColumns();
    },
    [resizeTreeColumns],
  );

  return (
    <>
      <div style={{ padding: 20 }}>
        <h3>Basic mode</h3>
        <h4>"Last Name" column is adjusted to header text</h4>
        <h4>"Email" column is adjusted to data</h4>
        <h4>"Company" column is adjusted to both data and header text</h4>
        <Grid
          data={data}
          columns={columns}
          init={init}
          onUpdateCell={() => resizeColumns()}
        />
      </div>

      <div style={{ padding: 20 }}>
        <h3>Tree mode</h3>
        <h4>"Last Name" column is adjusted to data</h4>
        <h4>"First Name" column is adjusted to header</h4>
        <h4>"City" column is adjusted to both data and header text</h4>
        <Grid
          init={treeInit}
          tree={true}
          data={treeData}
          columns={treeColumns}
          onUpdateCell={() => resizeTreeColumns()}
        />
      </div>
    </>
  );
}
