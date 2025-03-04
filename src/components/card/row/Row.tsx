import styled from '@emotion/styled';
import { KanbanComponent } from '@tarsilla/react-kanban-components';
import { FieldValues } from 'react-hook-form';

import { CardContractRow } from '@types';

import { Column } from '../column/index.js';
import { Field } from '../field/index.js';

const Container = styled.div`
  display: flex;
  flex-flow: row;
  column-gap: 4px;
  width: 100%;
  height: 100%;
`;

type Props<FormValue extends FieldValues> = {
  contract: CardContractRow<FormValue>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: KanbanComponent<any, any>[];
};

function Row<FormValue extends FieldValues>({ contract, components }: Props<FormValue>): JSX.Element {
  return (
    <Container style={contract.style}>
      {contract.fields?.map((field, index) => <Field contract={field} components={components} key={index} />)}
      {contract.rows?.map((row, index) => <Row contract={row} components={components} key={index} />)}
      {contract.columns?.map((column, index) => <Column contract={column} components={components} key={index} />)}
    </Container>
  );
}

export { Row };
