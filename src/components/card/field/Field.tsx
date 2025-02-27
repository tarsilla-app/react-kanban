import { CardContractField, CardValue } from '@types';

import { Text } from '../../text/index.js';

const components = {
  Text,
};

type Props = {
  field: CardContractField;
  values?: CardValue[];
};

function Field({ field, values }: Props): JSX.Element {
  const Component = components[field.component];

  const fieldValue = values?.find((value) => value.fieldId === field.id);
  const value = fieldValue?.value as string | undefined;

  return <Component id={field.id} value={value} style={field.style} />;
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
