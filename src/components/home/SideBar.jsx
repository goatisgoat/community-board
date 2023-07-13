import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Users = () => {
  const navigate = useNavigate();
  const { isUser, userSlice } = useSelector((state) => state.userSlice);

  // const navigate = useNavigate();
  // const { isUser, userSlice } = useSelector((state) => state.userSlice);
  // const navigate = useNavigate();
  // const { isUser, userSlice } = useSelector((state) => state.userSlice);
  // const navigate = useNavigate();
  // const { isUser, userSlice } = useSelector((state) => state.userSlice);

  // const navigate = useNavigate();
  // const { isUser, userSlice } = useSelector((state) => state.userSlice);
  // const navigate = useNavigate();
  // const { isUser, userSlice } = useSelector((state) => state.userSlice);
  // const navigate = useNavigate();
  // const { isUser, userSlice } = useSelector((state) => state.userSlice);

  // const navigate = useNavigate();
  // const { isUser, userSlice } = useSelector((state) => state.userSlice);
  // const navigate = useNavigate();
  // const { isUser, userSlice } = useSelector((state) => state.userSlice);
  // const navigate = useNavigate();
  // const { isUser, userSlice } = useSelector((state) => state.userSlice);

  const goToWrite = () => {
    if (isUser) {
      navigate("/write");
    } else {
      toast.error("로그인 후 이용해주세요", {
        theme: "colored",
      });
    }
  };
  return (
    <SideContainer>
      <p onClick={goToWrite}>
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
      <SideUserSpan>
        <div></div>
        {isUser ? <p>{userSlice.id}</p> : <p>로그인 후 이용</p>}
      </SideUserSpan>
    </SideContainer>
  );
};

export default Users;

const SideContainer = styled.div`
  width: 240px;
  height: 85vh;
  padding: 10px;
  position: fixed;
  top: 60px;
  left: 0;
  background-color: white;
  padding-top: 20px;

  & > p {
    padding: 15px 15px;
    font-size: 15px;
    cursor: pointer;
    margin-bottom: 10px;
    border-radius: 5px;
    background-color: #c0ead885;

    & > span {
      margin-right: 8px;
      color: #a4ce90;
    }
  }
`;

const SideUserSpan = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid #767e7a85;
  border-bottom: 1px solid #767e7a85;
  margin-top: 20px;
  padding-top: 30px;
  padding-bottom: 30px;

  & > div {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    background-color: #c2ffa6;
    margin-right: 10px;
  }

  & > p {
    font-size: 15px;
  }
`;
