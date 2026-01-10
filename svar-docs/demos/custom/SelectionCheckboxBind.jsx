import { Checkbox } from '@svar-ui/react-core';
import { useStore } from '@svar-ui/lib-react';

function SelectionCheckboxCell({ row, api }) {
  const selectedRows = useStore(api, 'selectedRows');

  function onChange(ev) {
    const { value } = ev;

    api.exec('select-row', {
      id: row.id,
      mode: value,
      toggle: true,
    });
  }

  return (
    <div data-action="ignore-click">
      <Checkbox
        onChange={onChange}
        value={selectedRows.indexOf(row.id) !== -1}
      />
    </div>
  );
}

export default SelectionCheckboxCell;
