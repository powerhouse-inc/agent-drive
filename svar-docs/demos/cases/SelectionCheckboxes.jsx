import { Grid } from '../../src';
import SelectionCheckboxCell from '../custom/SelectionCheckboxCell.jsx';
import SelectionCheckboxBind from '../custom/SelectionCheckboxBind.jsx';
import { getData } from '../data';
import './SelectionCheckboxes.css';

export default function SelectionCheckboxes() {
  const { data } = getData();

  const columns = [
    { id: 'selected', cell: SelectionCheckboxCell, width: 36 },
    { id: 'city', header: 'City', width: 160 },
    { id: 'firstName', header: 'First Name' },
    { id: 'lastName', header: 'Last Name' },
    { id: 'companyName', header: 'Company' },
  ];

  const columnsBind = [
    { id: 'selected', cell: SelectionCheckboxBind, width: 36 },
    { id: 'city', header: 'City', width: 160 },
    { id: 'firstName', header: 'First Name' },
    { id: 'lastName', header: 'Last Name' },
    { id: 'companyName', header: 'Company' },
  ];

  return (
    <>
      <div className="wx-Qu9z9lXi demo" style={{ padding: '20px' }}>
        <h4>Select only by checkboxes</h4>
        <div>
          <Grid data={data} columns={columns} select={false} />
        </div>
      </div>

      <div className="wx-Qu9z9lXi demo" style={{ padding: '20px' }}>
        <h4>Select by checkboxes and clicking</h4>
        <div>
          <Grid
            data={data}
            columns={columnsBind}
            multiselect={true}
            selectedRows={[13]}
          />
        </div>
      </div>
    </>
  );
}
