import { useEffect, useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { useKanban } from '../src/hooks/useKanban.js';
import { Kanban } from '../src/index.js';
import { Contract, KanbanValue } from '../src/types/index.js';

type Value = {
  field1: string;
};

const initialContract: Contract<Value> = {
  debounceWait: 2000,
  columns: [
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
                component: 'text',
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
                component: 'text',
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
                component: 'text',
                editable: true,
              },
            ],
          },
        ],
      },
    },
  ],
};

const initialValue: KanbanValue<Value> = {
  id: 'kanban1',
  columns: [
    {
      id: 'column1',
      cards: [
        {
          id: 'column1-card1',
          values: {
            field1: 'hello value 1',
          },
        },
      ],
    },
    {
      id: 'column2',
      cards: [
        {
          id: 'column2-card1',
          values: {
            field1: 'hello value 2',
          },
        },
      ],
    },
    {
      id: 'column3',
      cards: [],
    },
  ],
};

function CatchKanban({ contract }: { contract: Contract<Value> }): JSX.Element {
  try {
    const kanban = useKanban({ contract, value: initialValue });

    return (
      <Kanban kanban={kanban} onCardClick={(event) => console.log(event)} onChange={(event) => console.log(event)} />
    );
  } catch (error: unknown) {
    return <>{(error as Error).message}</>;
  }
}

function KanbanStory(): JSX.Element {
  const [value, setValue] = useState<string>(JSON.stringify(initialContract, null, 2));
  const [error, setError] = useState<string>();
  const [contract, setContract] = useState<Contract<Value>>(initialContract);

  useEffect(() => {
    try {
      const parsed = JSON.parse(value) as Contract<Value>;
      setContract(parsed);
      setError(undefined);
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }, [value]);
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
          rowGap: '4px',
          width: '25vw',
        }}
      >
        <textarea value={value} onChange={(event) => setValue(event.target.value)} rows={30} />
      </div>
      <div
        style={{
          display: 'flex',
          flexFlow: 'column',
          rowGap: '4px',
          borderWidth: '1px',
          borderColor: 'black',
          borderStyle: 'solid',
          width: '60vw',
          padding: '8px',
        }}
      >
        {error ? <>{error}</> : <CatchKanban contract={contract} />}
      </div>
    </div>
  );
}

const meta: Meta<typeof KanbanStory> = {
  title: 'KanbanBuilder',
  component: KanbanStory,
  parameters: {
    layout: 'centered',
    fullscreen: true,
  },
  argTypes: {},
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const KanbanBuilder: Story = {};
