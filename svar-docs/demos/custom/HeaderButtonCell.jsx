import { Button } from '@svar-ui/react-core';

export default function HeaderButtonCell({ onAction }) {
  function onClick() {
    onAction &&
      onAction({
        action: 'add-row',
        data: {
          row: {
            firstName: 'John',
            lastName: 'Smith',
            email: 'realemail@gmail.com',
            city: 'New York',
          },
        },
      });
  }

  return (
    <Button type="secondary" icon="wxi-plus" onClick={onClick}>
      Add row
    </Button>
  );
}
