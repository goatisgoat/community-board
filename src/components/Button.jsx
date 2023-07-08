import React from "react";
import { styled } from "styled-components";

const Button = ({ children, onClick }) => {
  return <Btn onClick={onClick}>{children}</Btn>;
};

export default Button;

const Btn = styled.button`
  padding: 7px 13px;
  margin: 6px;
  border-radius: 17px;
  border: 1px solid #7fd1ae;
  background-color: transparent;
  font-family: sans-serif;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background-color: #7fd1ae;
    color: white;
  }
`;
