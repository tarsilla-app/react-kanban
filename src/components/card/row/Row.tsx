import styled from '@emotion/styled';

import { CardContractRow, CardValue } from '@types';

import { Column } from '../column';
import { Field } from '../field';

type Props = {
  row: CardContractRow;
  values?: CardValue[];
};

const Container = styled.div`
  display: flex;
  flex-flow: row;
  column-gap: 4px;
  width: '100%';
  height: '100%';
`;

function Row({ row, values }: Props): JSX.Element {
  return (
    <Container style={row.style}>
      {row.fields?.map((field, index) => <Field field={field} values={values} key={index} />)}
      {row.rows?.map((row, index) => <Row row={row} values={values} key={index} />)}
      {row.columns?.map((column, index) => <Column column={column} values={values} key={index} />)}
    </Container>
  );
}

export { Row };
