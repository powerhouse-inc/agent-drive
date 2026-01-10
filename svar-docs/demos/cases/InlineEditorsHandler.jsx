import { useMemo } from 'react';
import { Grid } from '../../src';
import { getData } from '../data';

export default function InlineEditorsHandler() {
  const { data, countries } = useMemo(() => getData(), []);

  const properties = useMemo(
    () => ({
      firstName: 'text',
      lastName: 'text',
      id: null,
      email: 'text',
      companyName: 'text',
      country: {
        type: 'combo',
        config: {
          template: (option) => option.label,
          options: countries,
        },
      },
      date: 'datepicker',
      city: 'text',
      street: 'text',
      address: 'text',
      zipCode: 'text',
      followers: 'text',
      stars: 'text',
      phone: 'text',
      details: 'text',
    }),
    [countries],
  );

  const row = useMemo(() => data[0], [data]);

  const userData = useMemo(
    () =>
      Object.keys(properties).map((key) => ({
        id: key,
        property: key,
        value: row[key],
      })),
    [properties, row],
  );

  const columns = useMemo(
    () => [
      { id: 'property', header: 'Property', width: 200 },
      {
        id: 'value',
        header: 'Value',
        width: 270,
        editor: (row) => properties[row.id],
        template: (v, row) => {
          if (row.id === 'country')
            return countries.find((c) => c.id === v).label || v;
          return v instanceof Date ? v.toLocaleDateString() : v;
        },
      },
    ],
    [properties, countries],
  );

  return (
    <div style={{ padding: '20px' }}>
      <h4>Editable cells: different cell editors for the "Value" column</h4>
      <div>
        <Grid data={userData} columns={columns} />
      </div>
    </div>
  );
}
