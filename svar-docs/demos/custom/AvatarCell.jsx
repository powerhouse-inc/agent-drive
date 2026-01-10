import './AvatarCell.css';

export default function AvatarCell({ row }) {
  return (
    <div className="wx-utjM0Tbo container">
      <div className="wx-utjM0Tbo avatar">
        <div className="wx-utjM0Tbo user-avatar">
          {row.avatar ? (
            <img className="wx-utjM0Tbo user-photo" alt="" src={row.avatar} />
          ) : null}
        </div>
      </div>
      <div className="wx-utjM0Tbo info">
        <div className="wx-utjM0Tbo name">{row.lastName}</div>
        <div className="wx-utjM0Tbo mail">{row.email || ''}</div>
      </div>
    </div>
  );
}
