import { DropResult } from '@hello-pangea/dnd';
import { KanbanComponent } from '@tarsilla/react-kanban-components';
import { FieldValues } from 'react-hook-form';

import { Contract } from './Contract.js';
import { Theme } from './Theme.js';
import { UnknownObject } from './UnknownObject.js';
import { CardValue, KanbanValue } from './Value.js';

type UseKanbanProps<FormValue extends FieldValues> = {
  contract: Contract<FormValue>;
  value: KanbanValue<FormValue>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customComponents?: KanbanComponent<any, UnknownObject>[];
};

type UseKanbanReturnProps<FormValue extends FieldValues> = {
  contract: Omit<Contract<FormValue>, 'theme'> & { theme: Theme };
  value?: KanbanValue<FormValue>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: KanbanComponent<any, UnknownObject>[];
  onCardValueChange: (
    event: { value: CardValue<FormValue> },
    onChange?: (event: { value: KanbanValue<FormValue>; result?: DropResult }) => void,
  ) => void;
  onDragEnd: (
    result: DropResult,
    onChange?: (event: { value: KanbanValue<FormValue>; result: DropResult }) => void,
  ) => void;
};

export { type UseKanbanProps, type UseKanbanReturnProps };
