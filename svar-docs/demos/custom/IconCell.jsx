import './IconCell.css';

function IconCell(props) {
  const { row, column, onAction } = props;

  function onClick() {
    onAction &&
      onAction({
        action: 'custom-icon',
        data: {
          column: column.id,
          row: row.id,
        },
      });
  }

  return (
    <div
      className="wx-PsRvvvJD table_icon"
      data-action-id={row.id}
      onClick={onClick}
    >
      <i className="wx-PsRvvvJD wxi-dots-h"></i>
    </div>
  );
}

export default IconCell;
