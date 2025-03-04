import { CSSProperties } from 'react';

import { FieldValues, Path } from 'react-hook-form';

import { UnknownObject } from './UnknownObject.js';

type CardContract<FormValue extends FieldValues> = {
  rows?: CardContractRow<FormValue>[];
  columns?: CardContractColumn<FormValue>[];
  style?: CSSProperties;
};

type CardContractRow<FormValue extends FieldValues> = {
  fields?: CardContractField<FormValue>[];
  rows?: CardContractRow<FormValue>[];
  columns?: CardContractColumn<FormValue>[];
  style?: CSSProperties;
};

type CardContractColumn<FormValue extends FieldValues> = {
  fields?: CardContractField<FormValue>[];
  rows?: CardContractRow<FormValue>[];
  columns?: CardContractColumn<FormValue>[];
  style?: CSSProperties;
};

type CardContractField<FormValue extends FieldValues> = {
  id: Path<FormValue>;
  component: string;
  style?: CSSProperties;
} & UnknownObject;

export { type CardContract, type CardContractRow, type CardContractColumn, type CardContractField };
