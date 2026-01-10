import { useContext, useMemo } from 'react';
import storeContext from '../../context';
import { filters } from './filters';
import { useStore } from '@svar-ui/lib-react';

export default function Filter({ filter, column }) {
  const api = useContext(storeContext);
  const filterValues = useStore(api, 'filterValues');

  function filterRows(data) {
    api.exec('filter-rows', data);
  }

  const Component = useMemo(() => filters[filter.type], [filter.type]);

  return (
    <Component
      filter={filter}
      column={column}
      action={filterRows}
      filterValue={filterValues[column.id]}
    />
  );
}
