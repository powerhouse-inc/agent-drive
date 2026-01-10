import { useMemo } from 'react';
import './CustomTooltip.css';

export default function CustomTooltip({ data }) {
  const stars = useMemo(() => {
    const res = [];
    const max = 5;
    const n = Math.round((data.stars / 10000) * max);
    for (let i = 0; i < max; i++) {
      if (i < n) res.push({ filled: true });
      else res.push({});
    }
    return res;
  }, [data]);

  return (
    <div className="wx-RZBhyix5 data">
      <div className="wx-RZBhyix5 line">
        <b>Name:</b> {data.firstName} {data.lastName}
      </div>
      <div className="wx-RZBhyix5 line">
        <b>City:</b> {data.city || 'Unknown'}
      </div>
      <div className="wx-RZBhyix5 line">
        <b>Email:</b> {data.email}
      </div>
      <div className="wx-RZBhyix5 line">
        <b>Address:</b> {data.street}, {data.zipCode}
      </div>
      <div className="wx-RZBhyix5 line stars">
        {stars.map((star, idx) => (
          <i
            key={idx}
            className={`wx-RZBhyix5 wxi-cat${star.filled ? ' filled' : ''}`}
          ></i>
        ))}
        ({data.stars})
      </div>
      <div className="wx-RZBhyix5 line">
        <b>Followers:</b> {data.followers}
      </div>
    </div>
  );
}
