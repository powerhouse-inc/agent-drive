import { Button } from '@svar-ui/react-core';
import './ButtonCell.css';

function ButtonCell({ row, column, onAction }) {
  function onClick() {
    onAction &&
      onAction({
        action: 'custom-button',
        data: {
          column: column.id,
          row: row.id,
        },
      });
  }

  return (
    <>
      <span className="wx-wzokGf21 name">{row[column.id] || 'Unknown'}</span>
      <Button type="primary" disabled={!row[column.id]} onClick={onClick}>
        Show on map
      </Button>
    </>
  );
}

export default ButtonCell;
