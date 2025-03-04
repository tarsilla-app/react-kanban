import styled from '@emotion/styled';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { KanbanComponent } from '@tarsilla/react-kanban-components';
import { FieldValues } from 'react-hook-form';

import { CardContract, CardValue, ColumnValue, ContractColumn, Theme } from '@types';

import { grid } from '../constants.js';
import { List } from './list/index.js';
import { Title } from './title/index.js';

const Container = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: column;
`;

type Props<FormValue extends FieldValues> = {
  index: number;
  contract: ContractColumn<FormValue>;
  value?: ColumnValue<FormValue>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: KanbanComponent<any, any>[];
  theme: Theme;
  onCardValueChange: (event: { value: CardValue<FormValue> }) => void;
  onCardClick?: (event: { contract: CardContract<FormValue>; value: CardValue<FormValue> }) => void;

  isScrollable?: boolean;
  isCombineEnabled?: boolean;
};

function Column<FormValue extends FieldValues>({
  index,
  contract,
  value,
  components,
  theme,
  onCardValueChange,
  onCardClick,
  isScrollable,
  isCombineEnabled,
}: Props<FormValue>): JSX.Element {
  return (
    <Draggable key={contract.id} draggableId={contract.id} index={index} isDragDisabled={true}>
      {(provided: DraggableProvided, _snapshot: DraggableStateSnapshot) => (
        <Container
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={contract.style}
        >
          <Title title={contract.title} />
          <List
            contract={contract}
            value={value}
            components={components}
            internalScroll={isScrollable}
            isCombineEnabled={Boolean(isCombineEnabled)}
            theme={theme}
            onCardValueChange={onCardValueChange}
            onCardClick={onCardClick}
          />
        </Container>
      )}
    </Draggable>
  );
}

export { Column };
