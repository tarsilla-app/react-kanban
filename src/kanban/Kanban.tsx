import { Fragment } from 'react';

import styled from '@emotion/styled';
import { DragDropContext, DragDropContextProps, DropResult } from '@hello-pangea/dnd';
import { FieldValues } from 'react-hook-form';

import { CardContract, CardValue, KanbanValue, UseKanbanReturnProps } from '@types';

import { Board } from '../components/index.js';

type ParentContainerProps = {
  height: string;
};

const ParentContainer = styled.div<ParentContainerProps>`
  height: ${({ height }) => height};
  overflow-x: hidden;
  overflow-y: auto;
`;

type KanbanProps<FormValue extends FieldValues> = {
  kanban: UseKanbanReturnProps<FormValue>;

  onChange?: (event: { value: KanbanValue<FormValue>; result?: DropResult }) => void;
  onCardClick?: (event: { contract: CardContract<FormValue>; value: CardValue<FormValue> }) => void;
  withScrollableColumns?: boolean;
  isCombineEnabled?: boolean;
  containerHeight?: string;
  autoScrollerOptions?: DragDropContextProps['autoScrollerOptions'];
};

function Kanban<FormValue extends FieldValues>({
  kanban,

  onChange,
  onCardClick,
  withScrollableColumns,
  isCombineEnabled = false,
  containerHeight,
  autoScrollerOptions,
}: KanbanProps<FormValue>): JSX.Element {
  const { contract, value, components, onCardValueChange, onDragEnd } = kanban;
  const { columns, theme } = contract;
  const board = (
    <Board
      columns={columns}
      value={value}
      components={components}
      withScrollableColumns={withScrollableColumns}
      isCombineEnabled={isCombineEnabled}
      containerHeight={containerHeight}
      theme={theme}
      onCardValueChange={(result) => onCardValueChange(result, onChange)}
      onCardClick={onCardClick}
    />
  );

  return (
    <Fragment>
      <DragDropContext onDragEnd={(result) => onDragEnd(result, onChange)} autoScrollerOptions={autoScrollerOptions}>
        {containerHeight ? <ParentContainer height={containerHeight}>{board}</ParentContainer> : board}
      </DragDropContext>
    </Fragment>
  );
}

export { Kanban };
