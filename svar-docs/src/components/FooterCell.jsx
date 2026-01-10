import React, { useMemo, useContext, useCallback } from 'react';
import storeContext from '../context';
import { getStyle, getCssName } from '../helpers/columnWidth';
import './FooterCell.css';

function FooterCell({ cell, column, row, columnStyle }) {
  const api = useContext(storeContext);

  const style = useMemo(
    () =>
      getStyle(
        cell?.width,
        cell?.flexgrow,
        column?.fixed,
        column?.left,
        cell?.right ?? column?.right,
        cell?.height,
      ),
    [
      cell?.width,
      cell?.flexgrow,
      column?.fixed,
      column?.left,
      cell?.right,
      column?.right,
      cell?.height,
    ],
  );

  const css = useMemo(
    () => getCssName(column, cell, columnStyle),
    [column, cell, columnStyle],
  );

  const getCell = useCallback(() => {
    return Object.fromEntries(
      Object.entries(cell || {}).filter(([key]) => key !== 'cell'),
    );
  }, [cell]);

  const className =
    `wx-6Sdi3Dfd wx-cell ${css || ''} ${cell?.css || ''}` +
    (column?.fixed && column?.fixed.right ? ' wx-fixed-right' : '');

  return (
    <div className={className} style={style}>
      {!column?.collapsed && !cell?.collapsed ? (
        cell?.cell ? (
          React.createElement(cell.cell, {
            api,
            cell: getCell(),
            column,
            row,
            onAction: ({ action, data }) => api.exec(action, data),
          })
        ) : (
          <div className="wx-6Sdi3Dfd wx-text">{cell?.text || ''}</div>
        )
      ) : null}
    </div>
  );
}

export default FooterCell;
