import type { DraggableLocation } from '@hello-pangea/dnd';
import { FieldValues } from 'react-hook-form';

import { CardValue, ColumnValue } from '@types';

// a little function to help us with reordering the result
function reorder<TItem>(list: TItem[], startIndex: number, endIndex: number): TItem[] {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export default reorder;

interface ReorderQuoteMapArgs<FormValue extends FieldValues> {
  values: ColumnValue<FormValue>[];
  source: DraggableLocation;
  destination: DraggableLocation;
}

export interface ReorderQuoteMapResult<FormValue extends FieldValues> {
  values: ColumnValue<FormValue>[];
}

export const reorderQuoteMap = <FormValue extends FieldValues>({
  values,
  source,
  destination,
}: ReorderQuoteMapArgs<FormValue>): ReorderQuoteMapResult<FormValue> => {
  const current: CardValue<FormValue>[] = [...(values.find((value) => value.id === source.droppableId)?.cards ?? [])];
  const next: CardValue<FormValue>[] = [...(values.find((value) => value.id === destination.droppableId)?.cards ?? [])];
  const target: CardValue<FormValue> = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered: CardValue<FormValue>[] = reorder(current, source.index, destination.index);

    const result = values.reduce<ColumnValue<FormValue>[]>((values, value) => {
      if (value.id === source.droppableId) {
        values.push({
          id: value.id,
          cards: reordered,
        });
      } else {
        values.push(value);
      }
      return values;
    }, []);

    return {
      values: result,
    };
  }

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  const result = values.reduce<ColumnValue<FormValue>[]>((values, value) => {
    if (value.id === source.droppableId) {
      values.push({
        id: value.id,
        cards: current,
      });
    } else if (value.id === destination.droppableId) {
      values.push({
        id: value.id,
        cards: next,
      });
    } else {
      values.push(value);
    }
    return values;
  }, []);

  return {
    values: result,
  };
};

interface List<T> {
  id: string;
  values: T[];
}

interface MoveBetweenArgs<T> {
  list1: List<T>;
  list2: List<T>;
  source: DraggableLocation;
  destination: DraggableLocation;
}

interface MoveBetweenResult<T> {
  list1: List<T>;
  list2: List<T>;
}

export function moveBetween<T>({ list1, list2, source, destination }: MoveBetweenArgs<T>): MoveBetweenResult<T> {
  const newFirst = [...list1.values];
  const newSecond = [...list2.values];

  const moveFrom = source.droppableId === list1.id ? newFirst : newSecond;
  const moveTo = moveFrom === newFirst ? newSecond : newFirst;

  const [moved] = moveFrom.splice(source.index, 1);
  moveTo.splice(destination.index, 0, moved);

  return {
    list1: {
      ...list1,
      values: newFirst,
    },
    list2: {
      ...list2,
      values: newSecond,
    },
  };
}
