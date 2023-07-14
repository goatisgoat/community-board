import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handleSearchSlice } from "../redux/moduls/homeSlice";
import Button from "./Button";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";

const Navi = ({ boderBottomLine, backgroundColor }) => {
  const { isUser } = useSelector((state) => state.userSlice);
  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goToHome = () => {
    navigate("/");
  };
  const goToMyPage = () => {
    navigate("/");
  };
  const goToLogIn = () => {
    navigate("/login");
  };
  const goToSignUp = () => {
    navigate("/signup");
  };

  //로그아웃
  const LogOut = () => {
    removeCookie("accessToken", { path: "/" });
    window.location.reload();
  };

  //검색
  const handleSearch = (e) => {
    e.preventDefault();
    const userSearch = e.target[0].value;
    dispatch(handleSearchSlice(userSearch));
  };

  return (
    <NavContainer
      boderBottomLine={boderBottomLine}
      backgroundColor={backgroundColor}
    >
      <Logospan>
        <h1 onClick={goToHome}>Logo</h1>
        <p onClick={goToHome}>Home</p>
        <p onClick={goToHome}>Mypage</p>
      </Logospan>
      <Searchspan>
        <SearchForm onSubmit={handleSearch}>
          <input type="search" placeholder="Search" />
          <button type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </SearchForm>
        {!isUser ? (
          <>
            {" "}
            <Button onClick={goToLogIn}>Log In</Button>
            <Button onClick={goToSignUp}>Sign Up</Button>
          </>
        ) : (
          <Button onClick={LogOut}>Log Out</Button>
        )}
      </Searchspan>
    </NavContainer>
  );
};

export default Navi;

const NavContainer = styled.div`
  width: 100%;
  height: 60px;
  background-color: ${(props) =>
    props.backgroundColor ? "white" : "transparent"};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  border-bottom: ${(props) =>
    props.boderBottomLine ? "1px solid #767e7a85" : "transparent"};
  justify-content: space-between;
  z-index: 999;

  & > div {
    display: flex;
    align-items: center;
  }

  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 5px;
  }
`;

const Logospan = styled.span`
  & > h1 {
    margin: 0 10px;
    color: #7fd1ae;
    cursor: pointer;
  }
  & > p {
    color: #6a9582;
    margin-left: 8px;
    font-size: 15px;
    font-family: sans-serif;
    cursor: pointer;
  }
`;

const Searchspan = styled.span`
  padding-right: 10px;
`;

const SearchForm = styled.form`
  margin-right: 20px;
  border: 1px solid #7fd1ae;
  background-color: transparent;
  border-radius: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s;

  & > input {
    width: 0px;
    padding: 0;
    border: none;
    outline: none;
    transition: all 0.4s;
    background-color: transparent;
  }

  & > button {
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    background-color: transparent;
    cursor: pointer;
  }

  &:hover > input {
    width: 240px;
    margin-left: 10px;
  }
  &:hover > button {
    background-color: transparent;
  }
`;
