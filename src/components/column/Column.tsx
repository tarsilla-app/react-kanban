import styled from '@emotion/styled';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';

import { CardContract, CardValue, ColumnContract, ColumnValue, Theme } from '@types';

import { List } from './list';
import { Title } from './title';
import { grid } from '../constants';

const Container = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: column;
`;

type Props = {
  index: number;
  column: ColumnContract;
  value?: ColumnValue;
  isScrollable?: boolean;
  isCombineEnabled?: boolean;
  theme: Theme;
  onCardClick?: (card: CardContract, values?: CardValue[]) => void;
};

function Column({ index, column, value, isScrollable, isCombineEnabled, theme, onCardClick }: Props): JSX.Element {
  return (
    <Draggable key={column.id} draggableId={column.id} index={index} isDragDisabled={true}>
      {(provided: DraggableProvided, _snapshot: DraggableStateSnapshot) => (
        <Container
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={column.style}
        >
          <Title title={column.title} />
          <List
            column={column}
            value={value}
            internalScroll={isScrollable}
            isCombineEnabled={Boolean(isCombineEnabled)}
            theme={theme}
            onCardClick={onCardClick}
          />
        </Container>
      )}
    </Draggable>
  );
}

export { Column };
