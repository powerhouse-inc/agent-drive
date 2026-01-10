import { useEffect, useMemo } from 'react';
import { ContextMenu, registerMenuItem } from '@svar-ui/react-menu';
import HeaderMenuItem from './HeaderMenuItem.jsx';
import { useStoreLater } from '@svar-ui/lib-react';

export default function HeaderMenu({ columns = null, api, children }) {
  useEffect(() => {
    registerMenuItem('table-header', HeaderMenuItem);
  }, []);

  function getLabel(col) {
    for (let i = col.header.length - 1; i >= 0; i--) {
      const text = col.header[i].text;
      if (text) return text;
    }
    return col.id;
  }

  function headerMenuClick(e) {
    const col = e.action;
    if (col) {
      api.exec('hide-column', { id: col.id, mode: !col.hidden });
    }
  }

  function open(id) {
    return id;
  }

  const rColumns = useStoreLater(api, '_columns');

  const headerMenuOptions = useMemo(() => {
    if (api) {
      const source = Array.isArray(rColumns) ? rColumns : [];
      const included = columns ? source.filter((c) => columns[c.id]) : source;

      return included.map((c) => {
        const text = getLabel(c);
        return {
          id: c.id,
          text,
          type: 'table-header',
          hidden: c.hidden,
        };
      });
    } else {
      return [];
    }
  }, [api, columns, rColumns]);

  return (
    <ContextMenu
      dataKey="headerId"
      options={headerMenuOptions}
      onClick={headerMenuClick}
      at="point"
      resolver={open}
    >
      {typeof children === 'function' ? children() : children}
    </ContextMenu>
  );
}
