import { JSX } from 'react';

import { KanbanComponent } from '@tarsilla/react-kanban-components';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';

import { CardContractField } from '@types';

type Props<FormValue extends FieldValues> = {
  contract: CardContractField<FormValue>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: KanbanComponent<any, any>[];
};

function Field<FormValue extends FieldValues>({ contract, components }: Props<FormValue>): JSX.Element {
  const { control } = useFormContext<FormValue>();

  const { id, component, ...rest } = contract;

  const Component = components.find((c) => c.id === component);
  if (!Component) {
    throw new Error(`Component '${component}' not found`);
  }

  return (
    <Controller
      name={id}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Component.render id={id} onChange={onChange} value={value} {...rest} />
      )}
    />
  );
}

/*
{
  gap: 4px;
  display: flex;
  flex-flow: row;
  align-items: center;
}
*/

export { Field };
