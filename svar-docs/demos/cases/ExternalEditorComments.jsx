import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { RichSelect } from '@svar-ui/react-core';
import { Editor, registerEditorItem } from '@svar-ui/react-editor';
import { Comments } from '@svar-ui/react-comments';

import { Grid, getEditorConfig } from '../../src';
import { getData } from '../data';

import './ExternalEditorComments.css';

export default function ExternalEditorComments() {
  const { data, countries, users } = useMemo(() => {
    const { allData: data, countries, users } = getData();
    data.forEach((d, i) => {
      d.comments = !i
        ? [
            {
              id: 1,
              user: 1,
              content:
                'Greetings, fellow colleagues. I would like to share my insights on this task. I reckon we should deal with at least half of the points in the plan without further delays.',
              date: new Date(),
            },
            {
              id: 2,
              user: 2,
              content:
                "Hi, Diego. I am sure that that's exactly what is thought best out there in Dunwall. Let's just do what we are supposed to do to get the result.",
              date: new Date(),
            },
            {
              id: 5,
              user: 3,
              content:
                "Absolutely, Diego. Action speaks louder than words, and in this case, it's about executing the plan efficiently. Let's prioritize tasks and tackle them head-on.",
              date: new Date(),
            },
          ]
        : [];
    });
    return { data, countries, users };
  }, []);

  const columns = useMemo(() => {
    return [
      { id: 'id', width: 50 },
      {
        id: 'firstName',
        header: 'Name',
        editor: {
          type: 'text',
          label: 'First name',
          config: {
            placeholder: 'Enter first name',
          },
        },
        width: 160,
      },
      {
        id: 'country',
        header: 'Country',
        editor: 'combo',
        options: countries,
        width: 160,
      },
      {
        id: 'email',
        header: 'Email',
        width: 160,
      },
      {
        id: 'date',
        header: 'Date',
        width: 160,
        template: (v) => (v ? v.toLocaleDateString() : ''),
      },
      {
        id: 'companyName',
        header: 'Company',
      },
      {
        id: 'comments',
        header: 'Comments',
        template: (v) => `${v.length} ✉ `,
        width: 90,
        editor: {
          type: 'comments',
          label: 'Comments',
          users: users.map((user) => ({ ...user, name: user.label })),
          activeUser: 1,
        },
      },
    ];
  }, [countries, users]);

  useEffect(() => {
    registerEditorItem('combo', RichSelect);
    registerEditorItem('comments', Comments);
  }, []);

  const items = useMemo(() => getEditorConfig(columns), [columns]);

  const [dataToEdit, setDataToEdit] = useState(null);
  const api = useRef(null);

  const init = useCallback((apiArg) => {
    apiArg.intercept('open-editor', ({ id }) => {
      setDataToEdit(apiArg.getRow(id));
      return false;
    });
    apiArg.on('select-row', ({ id }) => {
      setDataToEdit((prev) => {
        if (prev) {
          return id ? apiArg.getRow(id) : null;
        }
        return prev;
      });
    });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h4>Grid - dbl-click to show external editor with comments</h4>
      <div style={{ height: '400px' }}>
        <Grid
          data={data}
          columns={columns}
          ref={api}
          init={init}
          columnStyle={(col) => (col.id === 'comments' ? 'center' : '')}
        />
      </div>
      {dataToEdit ? (
        <Editor
          values={dataToEdit}
          items={items}
          placement="sidebar"
          autoSave={true}
          onChange={({ key, value }) => {
            api.current.exec('update-cell', {
              id: dataToEdit.id,
              column: key,
              value,
            });
          }}
          onAction={({ item }) => {
            if (item.comp) setDataToEdit(null);
          }}
        />
      ) : null}
    </div>
  );
}
