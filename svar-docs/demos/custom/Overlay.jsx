import { Button } from '@svar-ui/react-core';

export default function Overlay(props) {
  const { onAction } = props;

  function showData() {
    onAction &&
      onAction({
        action: 'overlay-button-click',
        data: {
          show: true,
        },
      });
  }

  return (
    <>
      <div>Here is a component example</div>
      <div>Click the button to see the data</div>
      <Button type="primary" onClick={showData}>
        Show data
      </Button>
    </>
  );
}
