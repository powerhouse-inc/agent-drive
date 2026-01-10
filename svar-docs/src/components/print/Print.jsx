import { useContext, useEffect, useMemo, useRef } from 'react';
import Grid from './Grid.jsx';
import { getPrintColumns } from '@svar-ui/grid-store';
import storeContext from '../../context';
import './Print.css';

export default function Print(props) {
  const { config, ...restProps } = props;

  const api = useContext(storeContext);
  const { _skin: skin, _columns: columns } = api.getState();

  const grids = useMemo(() => getPrintColumns(columns, config), []);
  const nodeRef = useRef(null);

  useEffect(() => {
    const target = document.body;
    target.classList.add('wx-print');

    const node = nodeRef.current;
    if (!node) return;

    const cloned = node.cloneNode(true);
    target.appendChild(cloned);

    const rule = `@media print { @page { size: ${config.paper} ${config.mode}; }`;
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.setAttribute('media', 'print');
    document.getElementsByTagName('head')[0].appendChild(style);
    style.appendChild(document.createTextNode(rule));

    window.print();

    style.remove();
    target.classList.remove('wx-print');

    cloned.remove();
  }, []);

  return (
    <div
      className={`wx-4zwCKA7C wx-${skin}-theme wx-print-container`}
      ref={nodeRef}
    >
      {grids.map((cols, i) => (
        <div className="wx-4zwCKA7C wx-print-grid-wrapper" key={i}>
          <Grid columns={cols} {...restProps} />
        </div>
      ))}
    </div>
  );
}
