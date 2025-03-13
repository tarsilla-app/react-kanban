import { CSSProperties } from 'react';

import { FieldValues, Path } from 'react-hook-form';

type CardContract<FormValue extends FieldValues> = {
  rows?: CardContractRow<FormValue>[];
  columns?: CardContractColumn<FormValue>[];
  theme?: CSSProperties;
};

type CardContractRow<FormValue extends FieldValues> = {
  fields?: CardContractField<FormValue>[];
  rows?: CardContractRow<FormValue>[];
  columns?: CardContractColumn<FormValue>[];
  theme?: CSSProperties;
};

type CardContractColumn<FormValue extends FieldValues> = {
  fields?: CardContractField<FormValue>[];
  rows?: CardContractRow<FormValue>[];
  columns?: CardContractColumn<FormValue>[];
  theme?: CSSProperties;
};

type CardContractField<FormValue extends FieldValues> = {
  id: Path<FormValue>;
  component: string;
  theme?: CSSProperties;
} & Record<string, unknown>;

export { type CardContract, type CardContractRow, type CardContractColumn, type CardContractField };
