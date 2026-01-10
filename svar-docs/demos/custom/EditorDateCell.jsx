import './EditorDateCell.css';

function EditorDateCell(props) {
  const { data } = props;

  return (
    <>
      {data ? (
        <div className="wx-bOkubjgE date">
          <i className="wx-bOkubjgE wxi-calendar"></i>
          <span>{data.toLocaleDateString()}</span>
        </div>
      ) : (
        <span className="wx-bOkubjgE empty">no date</span>
      )}
    </>
  );
}

export default EditorDateCell;
