import { Willow as WillowCore } from '@svar-ui/react-core';
import './Willow.css';

function Willow({ fonts = true, children }) {
  if (children) {
    return <WillowCore fonts={fonts}>{children}</WillowCore>;
  } else {
    return <WillowCore fonts={fonts} />;
  }
}

export default Willow;
