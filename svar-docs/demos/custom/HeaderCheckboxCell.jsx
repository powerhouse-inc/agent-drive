import { Checkbox } from '@svar-ui/react-core';
import { useState, useEffect, useRef } from 'react';

export default function HeaderButtonCell({ api, onAction }) {
  const [value, setValue] = useState(false);

  const onCellCheck = useRef(null);

  useEffect(() => {
    const data = api.getReactiveState().data;
    return data.subscribe((data) => onCellCheck.current(data));
  }, [api]);

  onCellCheck.current = function (data) {
    const checked = data.every((d) => d.checked === true);

    if (value !== checked) {
      onAction &&
        onAction({
          action: 'custom-header-check',
          data: { value: checked },
        });
      setValue(checked);
    }
  };

  function onChange(ev) {
    const { value } = ev;
    setValue(value);

    onAction &&
      onAction({
        action: 'custom-header-check',
        data: { value, eventSource: 'click' },
      });
  }

  return <Checkbox value={value} onChange={onChange} />;
}
