import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const navigate = useNavigate();
  return (
    <UserContainer>
      <span>
        <div></div>
        <p>name</p>
      </span>
      <p onClick={() => navigate("/write")}>
        <span>
          <FontAwesomeIcon icon={faPenToSquare} />
        </span>
        Post
      </p>
      <p onClick={() => navigate("/")}>
        <span>
          <FontAwesomeIcon icon={faHouse} />
        </span>
        Home
      </p>
    </UserContainer>
  );
};

export default Users;

const UserContainer = styled.div`
  width: 240px;
  height: 85vh;
  border: 1px solid gray;
  padding: 10px;
  border-radius: 10px;
  position: fixed;
  top: 60px;
  left: 0;
  background-color: white;

  & > span {
    display: flex;
    align-items: center;
    border-bottom: 1px solid gray;
  }

  & > span > div {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    background-color: #c2ffa6;
    margin-right: 10px;
  }

  & > p {
    padding: 5px 15px;
    font-size: 15px;
    cursor: pointer;

    & > span {
      margin-right: 8px;
      color: #7fd1ae;
    }
  }
`;
