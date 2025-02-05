import { CSSProperties } from 'react';

enum ComponentType {
  Text = 'Text',
}

type Contract = {
  columns: ColumnContract[];
};

type ColumnContract = {
  id: string;
  title?: string;
  style?: CSSProperties;
  card: CardContract;
};

type CardContract = {
  rows?: CardContractRow[];
  columns?: CardContractColumn[];
  style?: CSSProperties;
};

type CardContractRow = {
  fields?: CardContractField[];
  rows?: CardContractRow[];
  columns?: CardContractColumn[];
  style?: CSSProperties;
};

type CardContractColumn = {
  fields?: CardContractField[];
  rows?: CardContractRow[];
  columns?: CardContractColumn[];
  style?: CSSProperties;
};

type CardContractField = {
  id: string;
  component: ComponentType;
  style?: CSSProperties;
};

type ColumnValue = {
  columnId: string;
  cards?: CardValue[];
};

type CardValue = {
  cardId: string;
  fieldId: string;
  value: unknown;
};

type Theme = {
  card: {
    textColor: string;
    primary: {
      backgroundColor: string;
      borderColor: string;
      boxShadow: string;
    };
    dragging: {
      backgroundColor: string;
      borderColor: string;
      boxShadow: string;
    };
    grouping: {
      backgroundColor: string;
      borderColor: string;
      boxShadow: string;
    };
  };
  column: {
    primary: {
      backgroundColor: string;
    };
    draggingOver: {
      backgroundColor: string;
    };
    draggingFrom: {
      backgroundColor: string;
    };
  };
};

export {
  ComponentType,
  type Contract,
  type ColumnContract,
  type CardContract,
  type CardContractRow,
  type CardContractColumn,
  type CardContractField,
  type ColumnValue,
  type CardValue,
  type Theme,
};
