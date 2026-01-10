import { useEffect, useRef, useState } from 'react';
import { Calendar, Dropdown } from '@svar-ui/react-core';
import './Datepicker.css';

export default function Datepicker({ actions, editor, onAction }) {
  const [value] = useState(() => editor.value || new Date());
  const [template] = useState(() => editor.config?.template);
  const [cell] = useState(() => editor.config?.cell);

  function updateValue({ value }) {
    actions.updateValue(value);
    actions.save();
  }

  const nodeRef = useRef(null);

  useEffect(() => {
    if (nodeRef.current) {
      nodeRef.current.focus();
    }
    if (typeof window !== 'undefined' && window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  }, []);

  return (
    <>
      <div
        className="wx-lNWNYUb6 wx-value"
        ref={nodeRef}
        tabIndex={0}
        onClick={() => actions.cancel()}
        onKeyDown={(ev) => ev.preventDefault()}
      >
        {template ? (
          template(value)
        ) : cell ? (
          (() => {
            const Component = cell;
            return <Component data={editor.value} onAction={onAction} />;
          })()
        ) : (
          <span className="wx-lNWNYUb6 wx-text">{editor.renderedValue}</span>
        )}
      </div>
      <Dropdown width={'auto'}>
        <Calendar
          value={value}
          onChange={updateValue}
          buttons={editor.config?.buttons}
        />
      </Dropdown>
    </>
  );
}
