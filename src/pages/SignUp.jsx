import React, { useState, useCallback } from "react";
import Navi from "../components/Navi";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import { toast } from "react-toastify";
import _ from "lodash";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  const [emailMessage, setEmailMessage] = useState("");
  const [passMessage, setPassMessage] = useState("");

  //name
  const handleName = (e) => {
    setName(e.target.value);
  };

  // email-debounce
  const handleDebounceEmail = useCallback(
    _.debounce(async (text) => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_RESISTER_URL}/users/?q=${text}`
      );
      data.forEach((item) => {
        if (item.email === text) {
          return setEmailMessage("이미 존재하는 아이디입니다");
        }
      });
    }, 2000),
    []
  );

  // email
  const handleEmail = async (e) => {
    setEmail(e.target.value);
    if (e.target.value === "") {
      return setEmailMessage("");
    }
    handleDebounceEmail(e.target.value);
  };

  //password
  const handlePassword = (e) => {
    setpassword(e.target.value);
    const expExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if (e.target.value === "") {
      setPassMessage("");
    } else if (password.match(expExp)) {
      setPassMessage("사용가능한 비밀번호입니다");
    } else if (!password.match(expExp)) {
      return setPassMessage("대문자, 숫자포함 8글자");
    }
  };

  //form
  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      //json-server-auth사용
      await axios.post(`${process.env.REACT_APP_RESISTER_URL}/register`, {
        name,
        email,
        password,
        uid: uuid(),
      });
      navigate("/login");
    } catch (error) {
      toast.error("회원가입에 실패하였습니다", {
        theme: "colored",
      });
    }
  };
  return (
    <>
      <Navi backgroundColor={false} />
      <Container>
        <FormBox onSubmit={handleSignUp}>
          <h2>Create an account</h2>
          <FormInputDiv>
            <input
              type="text"
              name="name"
              placeholder="name"
              required
              onChange={handleName}
            />
          </FormInputDiv>

          <FormInputDiv>
            <input
              type="email"
              name="email"
              placeholder="email"
              required
              onChange={handleEmail}
            />
            <p>{emailMessage}</p>
          </FormInputDiv>

          <FormInputDiv>
            <input
              type="password"
              name="password"
              placeholder="password"
              onChange={handlePassword}
              required
            />
            <p>{passMessage}</p>
          </FormInputDiv>

          <FormBtn type="submit">Sign Up</FormBtn>
        </FormBox>
      </Container>
    </>
  );
};

export default SignUp;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: #ccfbe5;
`;

const FormBox = styled.form`
  width: 500px;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: none;
  border-radius: 10px;
  background-color: white;
  position: relative;

  & > h2 {
    margin-bottom: 30px;
    color: #7fd1ae;
  }
`;

const FormInputDiv = styled.div`
  width: 60%;
  position: relative;

  & > input {
    width: 100%;
    height: 40px;
    border: none;
    margin-bottom: 30px;
    border-bottom: 1px solid #7fd1ae;
    position: relative;
  }

  & > input:focus {
    outline: none;
  }

  & > p {
    margin: 0;
    padding: 0;
    font-size: 11px;
    color: red;
    position: absolute;
    bottom: 10px;
  }
`;

const FormBtn = styled.button`
  margin-top: 20px;
  padding: 15px 50px;
  border-radius: 5px;
  border: 1px solid transparent;
  background-color: #7fd1ae;
  color: white;
  font-weight: 800;
  cursor: pointer;

  &:hover {
    background-color: white;
    border: 1px solid #7fd1ae;
    color: #7fd1ae;
  }
`;
