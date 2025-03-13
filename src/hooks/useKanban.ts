import { FieldValues } from 'react-hook-form';

import { Text } from '@tarsilla/react-kanban-components';

import { UseKanbanProps, UseKanbanReturnProps } from '@types';

import { useKanbanState } from './useKanbanState.js';
import { validateContract } from './validator/index.js';

const defaultTheme = {
  card: {
    textColor: 'red',
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

function useKanban<FormValue extends FieldValues>({
  contract,
  value,
  customComponents = [],
}: UseKanbanProps<FormValue>): UseKanbanReturnProps<FormValue> {
  const components = [Text, ...customComponents];

  validateContract({
    contract,
    allowedComponents: components.map((component) => component.id),
  });
  const _contract = {
    ...contract,
    theme: {
      ...defaultTheme,
      ...contract.theme,
    },
  };

  const [_value, onDragEnd, onCardValueChange] = useKanbanState<FormValue>({
    value,
    debounceWait: contract.debounceWait,
  });

  return {
    contract: _contract,
    value: _value,
    components,
    onCardValueChange,
    onDragEnd,
  };
}

export { useKanban };
