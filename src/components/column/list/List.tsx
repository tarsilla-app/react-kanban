import { CSSProperties, memo, ReactElement } from 'react';

import styled from '@emotion/styled';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import type {
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot,
} from '@hello-pangea/dnd';

import { CardContract, CardValue, ColumnContract, ColumnValue, Theme } from '@types';

import { Card } from '../../card';
import { grid } from '../../constants';

export const getBackgroundColor = (
  isDraggingOver: boolean,
  isDraggingFrom: boolean,
  theme: Theme['column'],
): string => {
  if (isDraggingOver) {
    return theme.draggingOver.backgroundColor;
  }
  if (isDraggingFrom) {
    return theme.draggingFrom.backgroundColor;
  }
  return theme.primary.backgroundColor;
};

interface WrapperProps {
  isDraggingOver: boolean;
  isDraggingFrom: boolean;
  isDropDisabled: boolean;
  theme: Theme['column'];
}

const Wrapper = styled.div<WrapperProps>`
  background-color: ${(props) => getBackgroundColor(props.isDraggingOver, props.isDraggingFrom, props.theme)};
  display: flex;
  flex-direction: column;
  opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')};
  padding: ${grid}px;
  border: ${grid}px;
  padding-bottom: 0;
  transition:
    background-color 0.2s ease,
    opacity 0.1s ease;
  user-select: none;
`;

const scrollContainerHeight = 250;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;

  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  padding-bottom: ${grid}px;
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: ${scrollContainerHeight}px;
`;

const Container = styled.div``;

type CardListProps = {
  card: CardContract;
  value?: ColumnValue;
  theme: Theme['card'];
  onCardClick?: (card: CardContract, values?: CardValue[]) => void;
};

type InnerCard = {
  id: string;
  values: CardValue[];
};

function InnerCardList({ card, value, theme, onCardClick }: CardListProps): ReactElement {
  const cards = value?.cards?.reduce<InnerCard[]>((cards, value) => {
    const card = cards.find((card) => card.id === value.cardId);
    if (card) {
      card.values.push(value);
    } else {
      cards.push({ id: value.cardId, values: [value] });
    }

    return cards;
  }, []);
  return (
    <>
      {cards?.map((innerCard: InnerCard, index: number) => (
        <Draggable key={innerCard.id} draggableId={innerCard.id} index={index}>
          {(dragProvided: DraggableProvided, dragSnapshot: DraggableStateSnapshot) => (
            <Card
              key={index}
              card={card}
              values={innerCard.values}
              isDragging={dragSnapshot.isDragging}
              isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
              provided={dragProvided}
              theme={theme}
              onClick={onCardClick}
            />
          )}
        </Draggable>
      ))}
    </>
  );
}

const InnerListMemo = memo<CardListProps>(InnerCardList);

type InnerListProps = {
  dropProvided: DroppableProvided;
  card: CardContract;
  value?: ColumnValue;
  theme: Theme['card'];
  onCardClick?: (card: CardContract, values?: CardValue[]) => void;
};

function InnerList({ card, value, dropProvided, theme, onCardClick }: InnerListProps) {
  //TODO test remove Container
  //TODO add card Style somewhere
  return (
    <Container>
      <DropZone ref={dropProvided.innerRef}>
        <InnerListMemo card={card} value={value} theme={theme} onCardClick={onCardClick} />
        {dropProvided.placeholder}
      </DropZone>
    </Container>
  );
}

type Props = {
  column: ColumnContract;
  value?: ColumnValue;
  internalScroll?: boolean;
  scrollContainerStyle?: CSSProperties;
  isDropDisabled?: boolean;
  isCombineEnabled?: boolean;
  style?: CSSProperties;
  // may not be provided - and might be null
  ignoreContainerClipping?: boolean;
  theme: Theme;
  onCardClick?: (card: CardContract, values?: CardValue[]) => void;
};

function List(props: Props): ReactElement {
  //TODO inner
  const { internalScroll, scrollContainerStyle, isDropDisabled, isCombineEnabled, column, value, theme, onCardClick } =
    props;

  return (
    <Droppable
      droppableId={column.id}
      type={'QUOTE'}
      ignoreContainerClipping={internalScroll}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
    >
      {(dropProvided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) => (
        <Wrapper
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDropDisabled={Boolean(isDropDisabled)}
          isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          theme={theme.column}
          {...dropProvided.droppableProps}
        >
          {internalScroll ? (
            <ScrollContainer style={scrollContainerStyle}>
              <InnerList
                card={column.card}
                value={value}
                dropProvided={dropProvided}
                theme={theme.card}
                onCardClick={onCardClick}
              />
            </ScrollContainer>
          ) : (
            <InnerList
              card={column.card}
              value={value}
              dropProvided={dropProvided}
              theme={theme.card}
              onCardClick={onCardClick}
            />
          )}
        </Wrapper>
      )}
    </Droppable>
  );
}

export { List };
