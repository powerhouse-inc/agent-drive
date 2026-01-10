import { WillowDark as WillowDarkCore } from '@svar-ui/react-core';
import './WillowDark.css';

function WillowDark({ fonts = true, children }) {
  if (children) {
    return <WillowDarkCore fonts={fonts}>{children}</WillowDarkCore>;
  } else {
    return <WillowDarkCore fonts={fonts} />;
  }
}

export default WillowDark;
