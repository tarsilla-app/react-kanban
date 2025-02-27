import { Fragment } from 'react';

import styled from '@emotion/styled';
import type { DragDropContextProps, DropResult } from '@hello-pangea/dnd';
import { DragDropContext } from '@hello-pangea/dnd';

import { CardContract, CardValue, ColumnContract, ColumnValue, Theme } from '@types';

import { Board } from '../components/index.js';

type ParentContainerProps = {
  height: string;
};

const ParentContainer = styled.div<ParentContainerProps>`
  height: ${({ height }) => height};
  overflow-x: hidden;
  overflow-y: auto;
`;

const defaultTheme = {
  card: {
    textColor: '#091E42',
    primary: {
      backgroundColor: '#FFFFFF',
      borderColor: 'transparent',
      boxShadow: 'none',
    },
    dragging: {
      backgroundColor: '#FFFAE6',
      borderColor: 'rgba(9, 30, 66, 0.71)',
      boxShadow: '2px 2px 1px #A5ADBA',
    },
    grouping: {
      backgroundColor: '#EBECF0',
      borderColor: 'transparent',
      boxShadow: 'none',
    },
  },

  column: {
    primary: {
      backgroundColor: '#EBECF0',
    },
    draggingOver: {
      backgroundColor: '#FFEBE6',
    },
    draggingFrom: {
      backgroundColor: '#E6FCFF',
    },
  },
};

type Props = {
  columns: ColumnContract[];
  values?: ColumnValue[];
  withScrollableColumns?: boolean;
  isCombineEnabled?: boolean;
  containerHeight?: string;
  autoScrollerOptions?: DragDropContextProps['autoScrollerOptions'];
  theme?: Theme;
  onDragEnd: (result: DropResult) => void;
  onCardClick?: (card: CardContract, values?: CardValue[]) => void;
};

function Kanban({
  columns,
  values,
  withScrollableColumns,
  isCombineEnabled = false,
  containerHeight,
  autoScrollerOptions,
  theme = defaultTheme,
  onDragEnd,
  onCardClick,
}: Props): JSX.Element {
  const board = (
    <Board
      columns={columns}
      values={values}
      withScrollableColumns={withScrollableColumns}
      isCombineEnabled={isCombineEnabled}
      containerHeight={containerHeight}
      theme={theme}
      onCardClick={onCardClick}
    />
  );

  return (
    <Fragment>
      <DragDropContext onDragEnd={onDragEnd} autoScrollerOptions={autoScrollerOptions}>
        {containerHeight ? <ParentContainer height={containerHeight}>{board}</ParentContainer> : board}
      </DragDropContext>
    </Fragment>
  );
}

export { Kanban };
