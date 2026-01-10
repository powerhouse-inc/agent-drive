import { useEffect, useRef, useState } from 'react';
import './Text.css';

function Text(props) {
  const { actions, editor } = props;

  const [value, setValue] = useState(editor?.value || '');

  const node = useRef(null);
  useEffect(() => {
    if (node.current) node.current.focus();
  }, []);

  function updateValue() {
    if (!node.current) return;
    setValue(node.current.value);
    actions.updateValue(node.current.value);
  }

  function closeAndSave({ key }) {
    if (key === 'Enter') actions.save();
  }

  return (
    <input
      className="wx-e7Ao5ejY wx-text"
      onInput={updateValue}
      onKeyDown={closeAndSave}
      ref={node}
      type="text"
      value={value}
    />
  );
}

export default Text;
