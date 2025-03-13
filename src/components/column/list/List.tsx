import { CSSProperties, memo, ReactElement } from 'react';

import styled from '@emotion/styled';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import type { DroppableProvided, DroppableStateSnapshot } from '@hello-pangea/dnd';
import { FieldValues } from 'react-hook-form';

import { KanbanComponent } from '@tarsilla/react-kanban-components';

import { CardContract, CardValue, ColumnValue, ContractColumn, Theme } from '@types';

import { Card } from '../../card/index.js';
import { grid } from '../../constants.js';

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

type WrapperProps = {
  isDraggingOver: boolean;
  isDraggingFrom: boolean;
  isDropDisabled: boolean;
  theme: Theme['column'];
};

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

// ...existing code...
function DraggableCard<FormValue extends FieldValues>({
  innerCard,
  index,
  contract,
  components,
  theme,
  onCardValueChange,
  onCardClick,
}: {
  innerCard: CardValue<FormValue>;
  index: number;
  contract: CardContract<FormValue>;
  components: KanbanComponent<unknown, object>[];
  theme: Theme['card'];
  onCardValueChange: (event: { value: CardValue<FormValue> }) => void;
  onCardClick?: (event: { contract: CardContract<FormValue>; value: CardValue<FormValue> }) => void;
}) {
  return (
    <Draggable draggableId={innerCard.id} index={index}>
      {(dragProvided, dragSnapshot) => (
        <Card
          key={innerCard.id}
          contract={contract}
          value={innerCard}
          components={components}
          isDragging={dragSnapshot.isDragging}
          isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
          provided={dragProvided}
          theme={theme}
          onCardValueChange={onCardValueChange}
          onCardClick={onCardClick}
        />
      )}
    </Draggable>
  );
}

type CardListProps<FormValue extends FieldValues> = {
  contract: CardContract<FormValue>;
  value?: ColumnValue<FormValue>;
  components: KanbanComponent<unknown, object>[];
  theme: Theme['card'];
  onCardValueChange: (event: { value: CardValue<FormValue> }) => void;
  onCardClick?: (event: { contract: CardContract<FormValue>; value: CardValue<FormValue> }) => void;
};

function InnerCardList<FormValue extends FieldValues>({
  contract,
  value,
  components,
  theme,
  onCardValueChange,
  onCardClick,
}: CardListProps<FormValue>): ReactElement {
  return (
    <>
      {value?.cards?.map((innerCard, index) => (
        <DraggableCard
          key={innerCard.id}
          innerCard={innerCard}
          index={index}
          contract={contract}
          components={components}
          theme={theme}
          onCardValueChange={onCardValueChange}
          onCardClick={onCardClick}
        />
      ))}
    </>
  );
}

const InnerListMemo = memo(InnerCardList) as <FormValue extends FieldValues>(
  props: CardListProps<FormValue>,
) => ReactElement;

type InnerListProps<FormValue extends FieldValues> = {
  contract: CardContract<FormValue>;
  value?: ColumnValue<FormValue>;
  components: KanbanComponent<unknown, object>[];
  theme: Theme['card'];
  onCardValueChange: (event: { value: CardValue<FormValue> }) => void;
  onCardClick?: (event: { contract: CardContract<FormValue>; value: CardValue<FormValue> }) => void;

  dropProvided: DroppableProvided;
};

function InnerList<FormValue extends FieldValues>({
  contract,
  value,
  components,
  dropProvided,
  theme,
  onCardValueChange,
  onCardClick,
}: InnerListProps<FormValue>) {
  //TODO add card Style somewhere
  return (
    <DropZone ref={dropProvided.innerRef}>
      <InnerListMemo
        contract={contract}
        value={value}
        components={components}
        theme={theme}
        onCardValueChange={onCardValueChange}
        onCardClick={onCardClick}
      />
      {dropProvided.placeholder}
    </DropZone>
  );
}

type Props<FormValue extends FieldValues> = {
  contract: ContractColumn<FormValue>;
  value?: ColumnValue<FormValue>;
  components: KanbanComponent<unknown, object>[];
  theme: Theme;
  onCardValueChange: (event: { value: CardValue<FormValue> }) => void;
  onCardClick?: (event: { contract: CardContract<FormValue>; value: CardValue<FormValue> }) => void;

  // may not be provided - and might be null
  ignoreContainerClipping?: boolean;
  internalScroll?: boolean;
  scrollContainerStyle?: CSSProperties;
  isDropDisabled?: boolean;
  isCombineEnabled?: boolean;
};

function List<FormValue extends FieldValues>({
  internalScroll,
  scrollContainerStyle,
  isDropDisabled,
  isCombineEnabled,
  contract,
  value,
  components,
  theme,
  onCardValueChange,
  onCardClick,
}: Props<FormValue>): ReactElement {
  return (
    <Droppable
      droppableId={contract.id}
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
                contract={contract.card}
                value={value}
                components={components}
                dropProvided={dropProvided}
                theme={theme.card}
                onCardValueChange={onCardValueChange}
                onCardClick={onCardClick}
              />
            </ScrollContainer>
          ) : (
            <InnerList
              contract={contract.card}
              value={value}
              components={components}
              dropProvided={dropProvided}
              theme={theme.card}
              onCardValueChange={onCardValueChange}
              onCardClick={onCardClick}
            />
          )}
        </Wrapper>
      )}
    </Droppable>
  );
}

export { List };
