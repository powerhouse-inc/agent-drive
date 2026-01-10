import './StatusCell.css';

export default function StatusCell({ row }) {
  let status = row.checked ? 'active' : 'non-active';

  return (
    <div className="container wx-Q4PjmCsS">
      <div className="status {status} wx-Q4PjmCsS">
        <div className="dot wx-Q4PjmCsS"></div>
        {status}
      </div>
    </div>
  );
}
