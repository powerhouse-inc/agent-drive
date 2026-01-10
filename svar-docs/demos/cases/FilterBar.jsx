import { useRef, useState, useMemo } from 'react';
import { Tabs } from '@svar-ui/react-core';
import {
  FilterBar as WxFilterBar,
  createFilter,
  getOptions,
} from '@svar-ui/react-filter';

import { Grid } from '../../src';
import { getData } from '../data';

function FilterBar() {
  const api = useRef(null);

  const [filterId, setFilterId] = useState(1);
  const filterTabs = [
    { id: 1, label: 'By all' },
    { id: 2, label: 'By city' },
    { id: 3, label: 'By the field' },
  ];

  const { data, columns } = useMemo(() => getData(), []);
  const cities = useMemo(() => getOptions(data, 'city'), [data]);

  function handleValueChange({ value }) {
    const filter = createFilter(value);
    if (api.current) {
      api.current.exec('filter-rows', { filter });
    }
  }

  function handleFilterChange({ value }) {
    setFilterId(value);
    if (api.current) {
      api.current.exec('filter-rows', { filter: null });
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h4>Filter grid data executing "filter-rows" action</h4>

      <Tabs
        value={filterId}
        options={filterTabs}
        onChange={handleFilterChange}
      />

      {filterId === 1 ? (
        <WxFilterBar
          fields={[
            {
              type: 'all',
              by: ['id', 'city', 'firstName', 'lastName', 'email'],
            },
          ]}
          onChange={handleValueChange}
        />
      ) : filterId === 2 ? (
        <WxFilterBar
          fields={[
            {
              type: 'text',
              id: 'city',
              options: cities,
            },
          ]}
          onChange={handleValueChange}
        />
      ) : filterId === 3 ? (
        <WxFilterBar
          fields={[
            {
              type: 'dynamic',
              by: ['city', 'firstName', 'lastName', 'email'],
            },
          ]}
          onChange={handleValueChange}
        />
      ) : null}

      <Grid data={data} columns={columns} ref={api} />
    </div>
  );
}

export default FilterBar;
