import { useEffect, useMemo, useRef, useState } from 'react';
import { SuggestDropdown } from '@svar-ui/react-core';
import './Richselect.css';

export default function Richselect(props) {
  const { actions, editor } = props;
  const onAction = props.onAction ?? props.onaction;

  const config = editor.config || {};

  const [data] = useState(
    editor.options.find((opt) => opt.id === editor.value),
  );
  const [value] = useState(editor.value);
  const [options] = useState(editor.options);

  const index = useMemo(
    () => options.findIndex((a) => a.id === value),
    [options, value],
  );

  function updateValue({ id }) {
    actions.updateValue(id);
    actions.save();
  }

  let navigate;
  const [keydown, setKeydown] = useState();

  function ready(ev) {
    navigate = ev.navigate;
    setKeydown(() => ev.keydown);
    navigate(index);
  }

  const node = useRef(null);
  useEffect(() => {
    if (node.current) {
      node.current.focus();
    }
    if (typeof window !== 'undefined' && window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  }, []);

  return (
    <>
      <div
        ref={node}
        className="wx-ywGRk611 wx-value"
        tabIndex={0}
        onClick={() => actions.cancel()}
        onKeyDown={(ev) => {
          keydown(ev, index);
          ev.preventDefault();
        }}
      >
        {config.template ? (
          config.template(data)
        ) : config.cell ? (
          (() => {
            const Component = config.cell;
            return <Component data={data} onAction={onAction} />;
          })()
        ) : (
          <span className="wx-ywGRk611 wx-text">{editor.renderedValue}</span>
        )}
      </div>
      <SuggestDropdown items={options} onReady={ready} onSelect={updateValue}>
        {({ option }) =>
          config.template
            ? config.template(option)
            : config.cell
              ? (() => {
                  const Component = config.cell;
                  return <Component data={option} onAction={onAction} />;
                })()
              : option.label
        }
      </SuggestDropdown>
    </>
  );
}
