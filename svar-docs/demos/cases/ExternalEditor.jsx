import { useState, useRef, useEffect, useCallback } from 'react';
import { RichSelect, Switch, DatePicker, MultiCombo } from '@svar-ui/react-core';
import { Editor, registerEditorItem } from '@svar-ui/react-editor';

import { Grid, getEditorConfig } from '../../src';
import { getData } from '../data';
const { allData: data, countries, users } = getData();

// Register editor items
registerEditorItem('richselect', RichSelect);
registerEditorItem('switch', Switch);
registerEditorItem('datepicker', DatePicker);
registerEditorItem('multicombo', MultiCombo);

export default function ExternalEditor() {
  const api = useRef(null);

  const columns = [
    { id: 'id', width: 50 },
    {
      id: 'firstName',
      header: 'Name',
      editor: 'text',
      width: 160,
    },
    {
      id: 'country',
      header: 'Country',
      editor: 'richselect',
      options: countries,
      width: 160,
    },
    {
      id: 'checked',
      hidden: true,
      header: 'Active',
      editor: 'switch',
      width: 160,
    },
    {
      id: 'newsletter',
      header: 'Newsletter',
      editor: 'checkbox',
      width: 100,
      template: (v) => (v ? 'yes' : 'no'),
    },
    {
      id: 'date',
      header: 'Date',
      width: 100,
      editor: 'datepicker',
      template: (v) => (v ? v.toLocaleDateString() : ''),
    },
    {
      id: 'assigned',
      header: 'Users',
      width: 100,
      editor: 'multicombo',
      options: users,
    },
    {
      id: 'companyName',
      header: 'Description',
      editor: 'textarea',
      flexgrow: 1,
    },
  ];

  const [dataToEdit, setDataToEdit] = useState(null);
  const dataToEditRef = useRef(null);
  useEffect(() => {
    dataToEditRef.current = dataToEdit;
  }, [dataToEdit]);

  const init = useCallback((gridApi) => {
    gridApi.intercept('open-editor', ({ id }) => {
      setDataToEdit(gridApi.getRow(id));
      return false;
    });
    gridApi.on('select-row', ({ id }) => {
      if (dataToEditRef.current) {
        setDataToEdit(id ? gridApi.getRow(id) : null);
      }
    });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h4>Grid - dbl-click to show external editor</h4>
      <div style={{ height: '320px', maxWidth: '800px' }}>
        <Grid data={data} columns={columns} ref={api} init={init} />
      </div>
      {dataToEdit ? (
        <Editor
          values={dataToEdit}
          items={getEditorConfig(columns)}
          topBar={{
            items: [
              {
                comp: 'icon',
                icon: 'wxi-close',
                id: 'close',
              },
              { comp: 'spacer' },
              {
                comp: 'button',
                type: 'danger',
                text: 'Delete',
                id: 'delete',
              },
              {
                comp: 'button',
                type: 'primary',
                text: 'Save',
                id: 'save',
              },
            ],
          }}
          placement="sidebar"
          onSave={({ values }) => {
            if (api.current) {
              api.current.exec('update-row', {
                id: dataToEdit.id,
                row: values,
              });
            }
          }}
          onAction={({ item }) => {
            if (item.id === 'delete' && api.current) {
              api.current.exec('delete-row', { id: dataToEdit.id });
            }
            if (item.comp) setDataToEdit(null);
          }}
        />
      ) : null}
    </div>
  );
}
