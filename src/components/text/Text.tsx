import { CSSProperties } from 'react';

import styled from '@emotion/styled';

const Label = styled.label``;

type Props = {
  id: string;
  value?: string;
  style?: CSSProperties;
};

function Text({ id, value, style }: Props): JSX.Element {
  return (
    <Label id={id} style={style}>
      {value}
    </Label>
  );
}

export { Text };
