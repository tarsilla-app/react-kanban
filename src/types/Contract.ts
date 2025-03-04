import { CSSProperties } from 'react';

import { FieldValues } from 'react-hook-form';

import { CardContract } from './CardContract.js';
import { Theme } from './Theme.js';

type Contract<FormValue extends FieldValues> = {
  columns: ContractColumn<FormValue>[];
  debounceWait?: number;
  theme?: Theme;
};

type ContractColumn<FormValue extends FieldValues> = {
  id: string;
  title?: string;
  style?: CSSProperties;
  card: CardContract<FormValue>;
};

export { type Contract, type ContractColumn };
