import { FieldValues } from 'react-hook-form';

import { CardContract, CardContractColumn, CardContractField, CardContractRow, Contract, ContractColumn } from '@types';

function validateCardFields<FormValue extends FieldValues>({
  fields,
  allowedComponents,
}: {
  fields?: CardContractField<FormValue>[];
  allowedComponents: string[];
}): string[] {
  return (
    fields?.reduce<string[]>((ids, field) => {
      if (!field.id) {
        throw new Error('Field id is required');
      } else if (!/^[A-Za-z0-9_]+$/.test(field.id)) {
        throw new Error('Field id must not contain special characters or spaces');
      } else if (!field.component) {
        throw new Error('Field component is required');
      } else if (!allowedComponents.includes(field.component)) {
        throw new Error(`Component '${field.component}' is not allowed`);
      } else if (field.debounceWait) {
        throw new Error('Field dont have debounceWait');
      }
      return [...ids, field.id as string];
    }, []) ?? []
  );
}

function validateCardRows<FormValue extends FieldValues>({
  rows,
  allowedComponents,
}: {
  rows?: CardContractRow<FormValue>[];
  allowedComponents: string[];
}): string[] {
  return (
    rows?.reduce<string[]>((ids, row) => {
      const rv = [row.fields, row.rows, row.columns].filter(Boolean);
      if (rv.length > 1) {
        throw new Error('Rows can only have fields or rows or columns');
      }
      const fieldsIds = validateCardFields({
        fields: row.fields,
        allowedComponents,
      });
      const rowsIds = validateCardRows({
        rows: row.rows,
        allowedComponents,
      });
      const columnsIds = validateCardColumns({
        columns: row.columns,
        allowedComponents,
      });

      return [...ids, ...fieldsIds, ...rowsIds, ...columnsIds];
    }, []) ?? []
  );
}

function validateCardColumns<FormValue extends FieldValues>({
  columns,
  allowedComponents,
}: {
  columns?: CardContractColumn<FormValue>[];
  allowedComponents: string[];
}): string[] {
  return (
    columns?.reduce<string[]>((ids, column) => {
      const rv = [column.fields, column.rows, column.columns].filter(Boolean);
      if (rv.length > 1) {
        throw new Error('Columns can only have fields or rows or columns');
      }
      const fieldsIds = validateCardFields({
        fields: column.fields,
        allowedComponents,
      });
      const rowsIds = validateCardRows({
        rows: column.rows,
        allowedComponents,
      });
      const columnsIds = validateCardColumns({
        columns: column.columns,
        allowedComponents,
      });

      return [...ids, ...fieldsIds, ...rowsIds, ...columnsIds];
    }, []) ?? []
  );
}

function validateCard<FormValue extends FieldValues>({
  card,
  allowedComponents,
}: {
  card: CardContract<FormValue>;
  allowedComponents: string[];
}): void {
  const rv = [card.rows, card.columns].filter(Boolean);
  if (rv.length > 1) {
    throw new Error('Card can only have rows or columns');
  }
  const rowsIds = validateCardRows({
    rows: card.rows,
    allowedComponents,
  });
  const columnsIds = validateCardColumns({
    columns: card.columns,
    allowedComponents,
  });

  const ids = [...rowsIds, ...columnsIds];

  ids.forEach((id) => {
    const equals = ids.filter((eq) => eq === id);
    if (!equals || equals.length > 1) {
      throw new Error(`id '${id}' is duplicated`);
    }
  });
}

function validateColumns<FormValue extends FieldValues>({
  columns,
  allowedComponents,
}: {
  columns?: ContractColumn<FormValue>[];
  allowedComponents: string[];
}): string[] {
  return (
    columns?.reduce<string[]>((ids, column) => {
      if (!column.id) {
        throw new Error('Column id is required');
      }
      if (!column.card) {
        throw new Error('Column card is required');
      }
      validateCard({
        card: column.card,
        allowedComponents,
      });

      return [...ids, column.id];
    }, []) ?? []
  );
}

function validateContract<FormValue extends FieldValues>({
  contract,
  allowedComponents,
}: {
  contract: Contract<FormValue>;
  allowedComponents: string[];
}): void {
  if (!contract.columns) {
    throw new Error('Contract columns is required');
  }
  const columnsIds = validateColumns({
    columns: contract.columns,
    allowedComponents,
  });

  const ids = [...columnsIds];

  ids.forEach((id) => {
    const equals = ids.filter((eq) => eq === id);
    if (!equals || equals.length > 1) {
      throw new Error(`id '${id}' is duplicated`);
    }
  });
}

export { validateContract };
