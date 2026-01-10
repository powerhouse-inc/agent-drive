import { Checkbox } from '@svar-ui/react-core';

function SelectionCheckboxCell({ row, api }) {
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
      <Checkbox onChange={onChange} />
    </div>
  );
}

export default SelectionCheckboxCell;
