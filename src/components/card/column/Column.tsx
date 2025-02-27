import styled from '@emotion/styled';

import { CardContractColumn, CardValue } from '@types';

import { Field } from '../field/index.js';
import { Row } from '../row/index.js';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  row-gap: 4px;
  width: '100%';
  height: '100%';
`;

type Props = {
  column: CardContractColumn;
  values?: CardValue[];
};

function Column({ column, values }: Props): JSX.Element {
  return (
    <Container style={column.style}>
      {column.fields?.map((field, index) => <Field field={field} values={values} key={index} />)}
      {column.rows?.map((row, index) => <Row row={row} values={values} key={index} />)}
      {column.columns?.map((column, index) => <Column column={column} values={values} key={index} />)}
    </Container>
  );
}

export { Column };
