import { Button } from '@svar-ui/react-core';
import './HeaderTextCell.css';

function HeaderTextCell() {
  return (
    <div className="wx-DH6iKuWS header-content">
      <Button type="secondary" icon="wxi-alert" />
      <span>Custom header content</span>
    </div>
  );
}

export default HeaderTextCell;
