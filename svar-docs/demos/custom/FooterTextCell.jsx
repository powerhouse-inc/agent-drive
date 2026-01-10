import './FooterTextCell.css';

export default function FooterTextCell({ cell }) {
  return (
    <div className="wx-phkQ7GfN footer-content">
      <span>{cell.text}</span>
      <i className="wx-phkQ7GfN wxi-check"></i>
    </div>
  );
}
