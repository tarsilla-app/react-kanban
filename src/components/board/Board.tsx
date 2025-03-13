import { JSX } from 'react';

import styled from '@emotion/styled';
import type { DroppableProvided } from '@hello-pangea/dnd';
import { Droppable } from '@hello-pangea/dnd';
import { FieldValues } from 'react-hook-form';

import { KanbanComponent } from '@tarsilla/react-kanban-components';

import { CardContract, CardValue, ContractColumn, KanbanValue, Theme } from '@types';

import { Column } from '../column/index.js';

//TODO theme
const Container = styled.div`
  background-color: #4c9aff;
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  //min-width: 100vw;
  display: inline-flex;
`;

type Props<FormValue extends FieldValues> = {
  columns: ContractColumn<FormValue>[];
  value?: KanbanValue<FormValue>;
  components: KanbanComponent<unknown, object>[];
  theme: Theme;
  onCardValueChange: (event: { value: CardValue<FormValue> }) => void;
  onCardClick?: (event: { contract: CardContract<FormValue>; value: CardValue<FormValue> }) => void;

  withScrollableColumns?: boolean;
  isCombineEnabled?: boolean;
  containerHeight?: string;
};

function Board<FormValue extends FieldValues>({
  columns,
  value,
  components,
  theme,
  onCardValueChange,
  onCardClick,
  withScrollableColumns,
  isCombineEnabled,
  containerHeight,
}: Props<FormValue>): JSX.Element {
  return (
    <Droppable
      droppableId='board'
      type='COLUMN'
      direction='horizontal'
      ignoreContainerClipping={Boolean(containerHeight)}
      isCombineEnabled={isCombineEnabled}
      isDropDisabled={true}
    >
      {(provided: DroppableProvided) => (
        <Container ref={provided.innerRef} {...provided.droppableProps}>
          {columns.map((column: ContractColumn<FormValue>, index: number) => {
            const columnValue = value?.columns?.find((value) => value.id === column.id);
            return (
              <Column
                key={column.id}
                index={index}
                contract={column}
                value={columnValue}
                components={components}
                isScrollable={withScrollableColumns}
                isCombineEnabled={isCombineEnabled}
                theme={theme}
                onCardValueChange={onCardValueChange}
                onCardClick={onCardClick}
              />
            );
          })}
          {provided.placeholder}
        </Container>
      )}
    </Droppable>
  );
}

export { Board };
