import React, { useState } from "react";
import styled from "styled-components";
import Comments from "./Comments";
import UserInputModal from "./UserInputModal";

const LeftSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <LeftContainer>
      <Comments />
      <UserInputBtn onClick={() => setIsOpen(!isOpen)}>+</UserInputBtn>
      {isOpen ? <UserInputModal /> : null}
    </LeftContainer>
  );
};

export default LeftSection;

const LeftContainer = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const UserInputBtn = styled.button`
  width: 35px;
  height: 35px;
  border-radius: 35px;
  border: none;
  background-color: #c2ffa6;
  position: fixed;
  right: 60px;
  bottom: 60px;
  z-index: 10;
  cursor: pointer;
`;

const InputBubble = styled.div`
  width: 120px;
  height: 100px;
  border: 1px solid black;
  border-radius: 5px;
  border: none;
  font-size: 13px;
  background-color: #c2ffa6;
  position: fixed;
  right: 20px;
  bottom: 120px;

  &::after {
    border-top: 0px solid transparent;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid pink;
    content: "";
    position: absolute;
    top: -10px;
    left: 200px;
  }
`;
