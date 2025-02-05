import { Dispatch, SetStateAction, useState } from 'react';

import { DraggableLocation, DropResult } from '@hello-pangea/dnd';
import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';

import { reorderQuoteMap } from './reorder';
import { Kanban } from '../src';
import { CardValue, ColumnContract, ColumnValue, ComponentType } from '../src/types';

function onDragEnd(
  result: DropResult,
  values: ColumnValue[],
  setValues: Dispatch<SetStateAction<ColumnValue[]>>,
): void {
  //COMBINE
  if (result.combine) {
    const newValues = values.reduce<ColumnValue[]>((values, value) => {
      if (value.columnId === result.source.droppableId) {
        const withQuoteRemoved: CardValue[] = [...(value.cards ?? [])];
        withQuoteRemoved.splice(result.source.index, 1);

        values.push({
          columnId: value.columnId,
          cards: withQuoteRemoved,
        });
      } else {
        values.push(value);
      }
      return values;
    }, []);

    setValues(newValues);
    return;
  }

  // dropped nowhere
  if (!result.destination) {
    return;
  }

  const source: DraggableLocation = result.source;
  const destination: DraggableLocation = result.destination;

  // did not move anywhere - can bail early
  if (source.droppableId === destination.droppableId && source.index === destination.index) {
    return;
  }

  const data = reorderQuoteMap({
    values,
    source,
    destination,
  });

  setValues(data.values);
}

function KanbanStory(): JSX.Element {
  const columns: ColumnContract[] = [
    {
      id: 'column1',
      title: 'Lane 1',
      style: {
        width: 'calc(calc(100% - calc(16px * 3) / 3)',
        maxWidth: '200px',
      },
      card: {
        rows: [
          {
            fields: [
              {
                id: 'field1',
                component: ComponentType.Text,
                /*style: {
                  color: 'red',
                },*/
              },
            ],
          },
        ],
      },
    },
    {
      id: 'column2',
      title: 'Lane 2',
      style: {
        width: 'calc(calc(100% - calc(16px * 3) / 3)',
        maxWidth: '200px',
      },
      card: {
        rows: [
          {
            fields: [
              {
                id: 'field1',
                component: ComponentType.Text,
              },
            ],
          },
        ],
        /*style: {
          color: 'blue',
        },*/
      },
    },
    {
      id: 'column3',
      title: 'Lane 3',
      style: {
        width: 'calc(calc(100% - calc(16px * 3) / 3)',
        maxWidth: '200px',
      },
      card: {
        rows: [
          {
            fields: [
              {
                id: 'field1',
                component: ComponentType.Text,
              },
            ],
          },
        ],
      },
    },
  ];

  const _values: ColumnValue[] = [
    {
      columnId: 'column1',
      cards: [
        {
          cardId: 'column1-card1',
          fieldId: 'field1',
          value: 'hello value 1',
        },
      ],
    },
    {
      columnId: 'column2',
      cards: [
        {
          cardId: 'column2-card1',
          fieldId: 'field1',
          value: 'hello value 2',
        },
      ],
    },
    {
      columnId: 'column3',
      cards: [],
    },
  ];

  const [values, setValues] = useState<ColumnValue[]>(_values);

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'row',
        rowGap: '4px',
        columnGap: '4px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexFlow: 'column',
          //rowGap: '4px',
          width: '25vw',
        }}
      >
        <textarea
          //value={contractEditorValue}
          //onChange={(event) => setContractEditorValue(event.target.value)}
          rows={30}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexFlow: 'column',
          //rowGap: '4px',
          borderWidth: '1px',
          borderColor: 'black',
          borderStyle: 'solid',
          width: '65vw',
          //padding: '8px',
          overflowX: 'auto',
        }}
      >
        <Kanban
          columns={columns}
          values={values}
          onDragEnd={(result) => onDragEnd(result, values, setValues)}
          isCombineEnabled={true}
        />
      </div>
    </div>
  );
}

const meta = {
  title: 'KanbanBuilder',
  component: KanbanStory,
  parameters: {
    layout: 'centered',
    fullscreen: true,
  },
  argTypes: {},
  args: {},
  decorators: [
    (Story, ctx) => {
      const [, setArgs] = useArgs<typeof ctx.args>();

      setArgs(ctx.args);

      return <Story args={{ ...ctx.args }} />;
    },
  ],
} satisfies Meta<typeof KanbanStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const KanbanBuilder: Story = {};
