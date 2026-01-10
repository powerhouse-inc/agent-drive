import { useContext } from 'react';
import storeContext from '../context';
import './Overlay.css';

export default function Overlay({ overlay }) {
  const api = useContext(storeContext);

  function isComponent(prop) {
    return typeof prop === 'function';
  }

  const Component = overlay;

  return (
    <div className="wx-1ty666CQ wx-overlay">
      {isComponent(overlay) ? (
        <Component onAction={({ action, data }) => api.exec(action, data)} />
      ) : (
        overlay
      )}
    </div>
  );
}
