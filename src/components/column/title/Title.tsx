import { JSX } from 'react';

import styled from '@emotion/styled';

import { borderRadius, grid } from '../../constants.js';

//TODO background-color theme???
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: #ebecf0;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e3fcef;
  }
`;

//TODO focus outline theme???
const Title = styled.h4`
  padding: ${grid}px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;

  &:focus {
    outline: 2px solid #998dd9;
    outline-offset: 2px;
  }
`;
type Props = {
  title?: string;
};

//TODO title style and title theme
function TitleComponent({ title }: Props): JSX.Element {
  return (
    <Header>
      <Title>{title}</Title>
    </Header>
  );
}

export { TitleComponent as Title };
