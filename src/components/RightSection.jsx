import React from "react";
import styled from "styled-components";
import Users from "./Users";

const RightSection = () => {
  return (
    <RightContainer>
      <Users />
    </RightContainer>
  );
};

export default RightSection;

const RightContainer = styled.div`
  width: 240px;
  height: 300px;
  border: 1px solid gray;
  border-radius: 10px;
  margin-right: 100px;
  margin-left: 10px;
  margin-top: 120px;
  padding: 10px;
`;
