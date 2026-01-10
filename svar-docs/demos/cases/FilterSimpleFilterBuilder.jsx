import { useMemo, useState, useCallback } from 'react';
import { FilterBuilder, createArrayFilter, getOptions } from '@svar-ui/react-filter';
import { getData } from '../data';
import { Grid } from '../../src';

const defaultValue = {
  rules: [
    {
      field: 'firstName',
      filter: 'contains',
      value: 'C',
    },
  ],
};

const FilterSimpleFilterBuilder = () => {
  const { data, columns } = useMemo(() => getData(), []);
  const [value, setValue] = useState(defaultValue);

  const options = useMemo(
    () => ({
      city: getOptions(data, 'city'),
      firstName: getOptions(data, 'firstName'),
      lastName: getOptions(data, 'lastName'),
      email: getOptions(data, 'email'),
    }),
    [data],
  );

  const fields = useMemo(
    () => [
      { id: 'city', label: 'City', type: 'text' },
      { id: 'firstName', label: 'First Name', type: 'text' },
      { id: 'lastName', label: 'Last Name', type: 'text' },
      { id: 'email', label: 'Email', type: 'text' },
    ],
    [],
  );

  const [filteredData, setFilteredData] = useState(() =>
    createArrayFilter(value)(data),
  );

  const applyFilter = useCallback(
    (val) => {
      setValue(val);
      setFilteredData(createArrayFilter(val)(data));
    },
    [data],
  );

  return (
    <div style={{ padding: '20px' }}>
      <h4>Filter data before parsing to Grid</h4>
      <FilterBuilder
        value={value}
        type={'simple'}
        fields={fields}
        options={options}
        onChange={(ev) => applyFilter(ev.value)}
      />
      <Grid data={filteredData} columns={columns} />
    </div>
  );
};

export default FilterSimpleFilterBuilder;
