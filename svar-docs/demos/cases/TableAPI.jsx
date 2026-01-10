import { useContext, useState } from "react";
import { useStoreLater } from "@svar-ui/lib-react";
import { Grid } from "../../src";
import { Button, context } from "@svar-ui/react-core";
import { getData } from "../data";


const rawData = getData().data;
const columns = [
	{
		id: "city",
		width: 200,
		header: { text: "City", rowspan: 2 },
		footer: "City",
		sort: true,
	},
	{
		id: "firstName",
		header: [
			{
				text: "First Name",
			},
			{ filter: "text" },
		],
		footer: "First Name",
		editor: "text",
		width: 150,
		sort: true,
	},
	{
		id: "lastName",
		header: [
			{
				text: "Last Name",
			},
			{ filter: "text" },
		],
		footer: "Last Name",
		editor: "text",
		width: 150,
		sort: true,
	},
	{
		id: "email",
		header: { text: "Email", rowspan: 2 },
		footer: "Email",
		sort: true,
	},
];

export default function Styling() {
  const [data, setData] = useState([...rawData]);
  const [api, setApi] = useState();
  const helpers = useContext(context.helpers);
  
  function init(api) {
    api.intercept("select-row", ev => {
      if (ev.id == 1) {
        helpers.showNotice({
          text: "Cannot be selected: " + ev.id,
          type: "warning",
        });
        return false;
      }
    });
    setApi(api);
  }
 
  function addRow() {
    api.exec("add-row", { row: {} });
  }
  function deleteRow() {
    const id = api.getState().selectedRows[0];
    if (id) {
      api.exec("delete-row", { id });
    }
  }
  function onSelectRow(ev) {
    helpers.showNotice({ text: "Selected: " + ev.id, type: "info" });
  }
	
  return (
    <div style={{ "padding": "20px" }}>
   	<p>
    		<Button onClick={addRow} type="primary">Add row</Button>
    		<Button onClick={deleteRow}>Delete row</Button>
    		<Button onClick={() => (setData(getData().data.slice(0,5)))}>Reload Data</Button>
   	</p>
   	<div style={{ "maxWidth": "800px" }}>
    		<Grid
   			data={data}
   			columns={columns}
   			init={init}
   			onSelectRow={onSelectRow}
    		/>
   	</div>
   	  <StatusLine api={api} />
    </div>
  )
}
function StatusLine({ api }) {
  const selected = useStoreLater(api, "selectedRows");
	return (
		<div style={{ padding: "6px 0" }}>
			Selected: {selected && selected.length ? selected.join(", ") : "none"}
		</div>
	);
}
