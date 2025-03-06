import { CSSProperties, JSX, memo, useEffect } from 'react';

import styled from '@emotion/styled';
import type { DraggableProvided } from '@hello-pangea/dnd';
import { KanbanComponent } from '@tarsilla/react-kanban-components';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';

import { CardContract, CardValue, Theme } from '@types';

import { borderRadius, grid } from '../constants.js';
import { Column } from './column/index.js';
import { Row } from './row/index.js';

function getBackgroundColor(isDragging: boolean, isGroupedOver: boolean, theme: Theme['card']): string {
  if (isDragging) {
    return theme.dragging.backgroundColor;
  }

  if (isGroupedOver) {
    return theme.grouping.backgroundColor;
  }

  return theme.primary.backgroundColor;
}

function getBorderColor(isDragging: boolean, isGroupedOver: boolean, theme: Theme['card']): string {
  if (isDragging) {
    return theme.dragging.borderColor;
  }

  if (isGroupedOver) {
    return theme.grouping.borderColor;
  }

  return theme.primary.borderColor;
}

function getBoxShadow(isDragging: boolean, isGroupedOver: boolean, theme: Theme['card']): string {
  if (isDragging) {
    return theme.dragging.boxShadow;
  }

  if (isGroupedOver) {
    return theme.grouping.boxShadow;
  }

  return theme.primary.boxShadow;
}

const minHeight = 40;

type ContainerProps = {
  theme: Theme['card'];
  isDragging: boolean;
  isGroupedOver: boolean;
};

const Container = styled.div<ContainerProps>`
  border-radius: ${borderRadius}px;
  border: 2px solid transparent;
  border-color: ${(props) => getBorderColor(props.isDragging, props.isGroupedOver, props.theme)};
  background-color: ${(props) => getBackgroundColor(props.isDragging, props.isGroupedOver, props.theme)};
  box-shadow: ${(props) => getBoxShadow(props.isDragging, props.isGroupedOver, props.theme)};
  box-sizing: border-box;
  padding: ${grid}px;
  min-height: ${minHeight}px;
  margin-bottom: ${grid}px;
  user-select: none;

  /* anchor overrides */
  color: ${(props) => props.theme.textColor};

  &:hover,
  &:active {
    color: ${(props) => props.theme.textColor};
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.dragging.borderColor};
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

function getStyle(provided: DraggableProvided, style?: CSSProperties | null) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style,
  };
}

type CardProps<FormValue extends FieldValues> = {
  contract: CardContract<FormValue>;
  value: CardValue<FormValue>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: KanbanComponent<any, any>[];
  theme: Theme['card'];
  onCardValueChange: (event: { value: CardValue<FormValue> }) => void;
  onCardClick?: (event: { contract: CardContract<FormValue>; value: CardValue<FormValue> }) => void;

  isDragging: boolean;
  isGroupedOver?: boolean;
  provided: DraggableProvided;
};

function CardComponent<FormValue extends FieldValues>(props: CardProps<FormValue>): JSX.Element {
  const { contract, value, components, theme, onCardValueChange, onCardClick, isDragging, isGroupedOver, provided } =
    props;

  const methods = useForm<FormValue>({
    values: value?.values,
  });
  const formValues = methods.watch();

  useEffect(() => {
    onCardValueChange({ value: { id: value.id, values: formValues } });
  }, [value, formValues, onCardValueChange]);

  return (
    <FormProvider {...methods}>
      <Container
        isDragging={isDragging}
        isGroupedOver={Boolean(isGroupedOver)}
        theme={theme}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={getStyle(provided, contract.theme)}
        //data-is-dragging={isDragging}
        //data-testid={`card-${index}`}
        //data-index={index}
        //aria-label={`${quote.author.name} quote ${quote.content}`}
        onClick={() => onCardClick?.({ contract, value })}
      >
        {contract.rows?.map((row, index) => <Row contract={row} components={components} key={index} />)}
        {contract.columns?.map((column, index) => <Column contract={column} components={components} key={index} />)}
      </Container>
    </FormProvider>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CardMemo = memo<CardProps<any>>(CardComponent);

export { CardMemo as Card };
