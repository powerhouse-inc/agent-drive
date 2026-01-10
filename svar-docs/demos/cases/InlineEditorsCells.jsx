import { useMemo } from 'react';
import { Grid } from '../../src';
import { getData } from '../data';
import SelectEditorCell from '../custom/SelectEditorCell.jsx';
import EditorDateCell from '../custom/EditorDateCell.jsx';
import EditorSelectCell from '../custom/EditorSelectCell.jsx';

export default function InlineEditorsCells() {
  const { allData: data, countries, users } = useMemo(() => getData(), []);

  const columns = useMemo(
    () => [
      { id: 'id', width: 50 },
      {
        id: 'country',
        header: 'Country - "combo"',
        editor: {
          type: 'combo',
          config: { cell: EditorSelectCell },
        },
        options: countries,
        cell: SelectEditorCell,
        width: 180,
      },
      {
        id: 'date',
        header: 'Date - "datepicker"',
        width: 180,
        editor: {
          type: 'datepicker',
          config: { cell: EditorDateCell },
        },
        template: (v) => (v ? v.toLocaleDateString() : ''),
      },
      {
        id: 'user',
        header: 'User - "richselect"',
        width: 180,
        editor: {
          type: 'richselect',
          config: { cell: EditorSelectCell },
        },
        options: users,
        cell: SelectEditorCell,
      },
    ],
    [countries, users],
  );

  return (
    <div style={{ padding: '20px' }}>
      <h4>Editable cells: inline editors with custom cells</h4>
      <div>
        <Grid data={data} columns={columns} />
      </div>
    </div>
  );
}
