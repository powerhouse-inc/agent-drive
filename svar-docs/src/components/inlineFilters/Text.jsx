import { Text } from '@svar-ui/react-core';
import './Text.css';

export default function Component({ filter, column, action, filterValue }) {
  function filterRows({ value }) {
    action({ value, key: column.id });
  }

  return (
    <Text
      {...(filter.config ?? {})}
      value={filterValue}
      onChange={filterRows}
    />
  );
}
