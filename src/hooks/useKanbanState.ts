import { useRef, useState } from 'react';

import { DraggableLocation, DropResult } from '@hello-pangea/dnd';
import debounce from 'debounce';
import { FieldValues } from 'react-hook-form';

import { CardValue, ColumnValue, KanbanValue } from '@types';

import { reorderQuoteMap } from './reorder/index.js';

function useKanbanState<FormValue extends FieldValues>({
  value,
  debounceWait,
}: {
  value: KanbanValue<FormValue>;
  debounceWait?: number;
}): [
  KanbanValue<FormValue>,
  (result: DropResult, onChange?: (event: { value: KanbanValue<FormValue>; result: DropResult }) => void) => void,
  (event: { value: CardValue<FormValue> }, onChange?: (event: { value: KanbanValue<FormValue> }) => void) => void,
] {
  const [_value, _setValue] = useState<KanbanValue<FormValue>>(value);
  const onChangeRef = useRef<((event: { value: KanbanValue<FormValue>; result?: DropResult }) => void) | null>(null);
  const debounceRef = useRef<(e: { value: KanbanValue<FormValue>; result?: DropResult }) => void>(
    debounce((event: { value: KanbanValue<FormValue>; result?: DropResult }) => {
      onChangeRef.current?.(event);
    }, debounceWait),
  );

  function getDebouncedOnChange(onChange?: (e: { value: KanbanValue<FormValue>; result?: DropResult }) => void) {
    onChangeRef.current = onChange ?? null;
    if (debounceWait && onChange) {
      return debounceRef.current;
    }
    return (event: { value: KanbanValue<FormValue>; result?: DropResult }) => onChangeRef.current?.(event);
  }

  function onDragEnd(
    result: DropResult,
    onChange?: (event: { value: KanbanValue<FormValue>; result: DropResult }) => void,
  ): void {
    const debouncedOnChange = getDebouncedOnChange(({ value, result }) => onChange?.({ value, result: result! }));
    const currentValue = _value;

    //COMBINE
    if (result.combine) {
      const _columns = currentValue.columns?.reduce<ColumnValue<FormValue>[]>((columns, column) => {
        if (column.id === result.source.droppableId) {
          const withQuoteRemoved: CardValue<FormValue>[] = [...(column.cards ?? [])];
          withQuoteRemoved.splice(result.source.index, 1);

          columns.push({
            id: column.id,
            cards: withQuoteRemoved,
          });
        } else {
          columns.push(column);
        }
        return columns;
      }, []);

      const newValue = { id: currentValue.id, columns: _columns };
      _setValue(newValue);
      debouncedOnChange?.({ value: newValue, result });
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

    const _columns = reorderQuoteMap({
      columns: currentValue.columns ?? [],
      source,
      destination,
    });

    const newValue = { id: currentValue.id, columns: _columns };
    _setValue(newValue);
    debouncedOnChange?.({ value: newValue, result });
  }

  function onValueChange(
    event: { value: CardValue<FormValue> },
    onChange?: (event: { value: KanbanValue<FormValue> }) => void,
  ) {
    const debouncedOnChange = getDebouncedOnChange(onChange);
    const currentValue = _value;
    let dirty = false;
    const _columns = currentValue.columns?.map((column) => {
      const _cards = column.cards?.map((card) => {
        if (card.id === event.value.id && JSON.stringify(card.values) !== JSON.stringify(event.value.values)) {
          dirty = true;
          return event.value;
        }
        return card;
      });
      return { ...column, cards: _cards };
    });
    if (dirty) {
      const newValue = { id: currentValue.id, columns: _columns };
      _setValue(newValue);
      debouncedOnChange?.({ value: newValue, result: undefined as unknown as DropResult });
    }
  }

  return [_value, onDragEnd, onValueChange];
}

export { useKanbanState };
