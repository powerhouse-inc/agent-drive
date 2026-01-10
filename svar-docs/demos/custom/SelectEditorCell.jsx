import { useMemo } from 'react';
import EditorSelectCell from './EditorSelectCell.jsx';

export default function SelectEditorCell({ row, column }) {
  const data = useMemo(() => {
    const options = column.options;
    return options?.find((o) => o.id == row[column.id]);
  }, [row, column]);

  return <EditorSelectCell data={data} />;
}
