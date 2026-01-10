import { Checkbox } from '@svar-ui/react-core';

export default function CheckboxCell({ row, column, onAction, api }) {
  function onChange(ev) {
    const { value } = ev;

    api.exec('update-cell', {
      id: row.id,
      column: column.id,
      value,
    });

    onAction &&
      onAction({
        action: 'custom-check',
        data: {
          value,
          column: column.id,
          row: row.id,
        },
      });
  }

  return <Checkbox value={row[column.id]} onChange={onChange} />;
}
