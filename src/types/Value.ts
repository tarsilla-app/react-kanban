import { FieldValues } from 'react-hook-form';

type KanbanValue<FormValue extends FieldValues> = {
  id: string;
  columns?: ColumnValue<FormValue>[];
};

type ColumnValue<FormValue extends FieldValues> = {
  id: string;
  cards?: CardValue<FormValue>[];
};

type CardValue<FormValue extends FieldValues> = {
  id: string;
  values?: FormValue;
};

export { type ColumnValue, type CardValue, type KanbanValue };
