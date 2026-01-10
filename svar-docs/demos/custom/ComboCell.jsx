import { useMemo, useCallback } from 'react';
import { Combo } from '@svar-ui/react-core';

function ComboCell(props) {
  const { row, column } = props;
  const onAction = props.onAction || props.onaction;

  const options = useMemo(
    () => [
      { id: 1, label: 'New Amieshire' },
      { id: 2, label: 'New Gust' },
      { id: 3, label: 'Lefflerstad' },
      { id: 4, label: 'East Catalina' },
      { id: 5, label: 'Ritchieborough' },
    ],
    [],
  );

  const id = useMemo(() => {
    const option = options.find((i) => i.label === row[column.id]);
    return option && option.id ? option.id : 1;
  }, [options, row, column]);

  const onChange = useCallback(
    (ev) => {
      const { value } = ev;
      onAction &&
        onAction({
          action: 'custom-combo',
          data: {
            value: options.find((i) => i.id === value).label,
            column: column.id,
            row: row.id,
          },
        });
    },
    [onAction, options, column, row],
  );

  return (
    <Combo options={options} value={id} onChange={onChange}>
      {({ option }) => option.label}
    </Combo>
  );
}

export default ComboCell;
