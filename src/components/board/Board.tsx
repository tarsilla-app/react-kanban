import styled from '@emotion/styled';
import type { DroppableProvided } from '@hello-pangea/dnd';
import { Droppable } from '@hello-pangea/dnd';

import { CardContract, CardValue, ColumnContract, ColumnValue, Theme } from '@types';

import { Column } from '../column/index.js';

//TODO theme
const Container = styled.div`
  background-color: #4c9aff;
  min-height: 100vh;
  /* like display:flex but will allow bleeding over the window width */
  //min-width: 100vw;
  display: inline-flex;
`;

type Props = {
  columns: ColumnContract[];
  values?: ColumnValue[];
  withScrollableColumns?: boolean;
  isCombineEnabled?: boolean;
  containerHeight?: string;
  theme: Theme;
  onCardClick?: (card: CardContract, values?: CardValue[]) => void;
};

function Board({
  columns,
  values,
  withScrollableColumns,
  isCombineEnabled,
  containerHeight,
  theme,
  onCardClick,
}: Props): JSX.Element {
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
          {columns.map((column: ColumnContract, index: number) => {
            const value = values?.find((value) => value.columnId === column.id);
            return (
              <Column
                key={column.id}
                index={index}
                column={column}
                value={value}
                isScrollable={withScrollableColumns}
                isCombineEnabled={isCombineEnabled}
                theme={theme}
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
