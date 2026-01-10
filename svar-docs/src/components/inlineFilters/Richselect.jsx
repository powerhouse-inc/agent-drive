import { useMemo, useContext } from 'react';
import { RichSelect } from '@svar-ui/react-core';
import { getValue } from '@svar-ui/grid-store';
import storeContext from '../../context';
import { useStore } from '@svar-ui/lib-react';
import './Richselect.css';

export default function Richselect({ filter, column, action, filterValue }) {
  const api = useContext(storeContext);
  const data = useStore(api, 'flatData');

  const options = useMemo(
    () => filter?.config?.options || column?.options || getOptions(data),
    [filter, column, data],
  );

  const template = useMemo(() => filter?.config?.template, [filter]);

  function getOptions() {
    const options = [];
    data.forEach((d) => {
      const value = getValue(d, column);
      if (!options.includes(value)) options.push(value);
    });
    return options.map((opt) => ({ id: opt, label: opt }));
  }

  function filterRows({ value }) {
    action({ value, key: column.id });
  }

  function handleKeyDown(ev) {
    if (ev.key !== 'Tab') ev.preventDefault();
  }

  return (
    <div style={{ width: '100%' }} onKeyDown={handleKeyDown}>
      <RichSelect
        placeholder={''}
        clear={true}
        {...(filter?.config ?? {})}
        options={options}
        value={filterValue}
        onChange={filterRows}
      >
        {(option) => (template ? template(option) : option.label)}
      </RichSelect>
    </div>
  );
}
