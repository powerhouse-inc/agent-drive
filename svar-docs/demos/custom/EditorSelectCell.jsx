import './EditorSelectCell.css';

function EditorSelectCell({ data }) {
  return data ? (
    <div className="wx-SeTmaThJ container">
      <div className="wx-SeTmaThJ avatar">
        <span>{data.label[0]}</span>
      </div>
      <span className="wx-SeTmaThJ name">{data.label}</span>
    </div>
  ) : (
    <span className="wx-SeTmaThJ empty">not selected</span>
  );
}

export default EditorSelectCell;
