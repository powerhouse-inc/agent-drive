import './HeaderMenuItem.css';

function HeaderMenuItem({ item }) {
  return (
    <div
      tabIndex={-1}
      role="menuitem"
      aria-label={
        item.hidden ? `Show ${item.text} column` : `Hide ${item.text} column`
      }
    >
      <div
        className={'wx-v13lZxja wx-icon' + (item.hidden ? ' wx-hidden' : '')}
      >
        <i className="wx-v13lZxja wxi-eye"></i>
      </div>
      <span>{item.text}</span>
    </div>
  );
}

export default HeaderMenuItem;
