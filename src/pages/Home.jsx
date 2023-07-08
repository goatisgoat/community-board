import React from "react";
import styled from "styled-components";
import Navi from "../components/Navi";
import Footer from "../components/Footer";
import Comments from "../components/Comments";
import Users from "../components/Users";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navi />
      <Container>
        <Users />
        <Comments />
        <UserInputBtn onClick={() => navigate("/write")}>+</UserInputBtn>
      </Container>
      <Footer />
    </>
  );
};

export default Home;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 80px;
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
