import React from "react";
import Navi from "../components/Navi";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { handleUserSlice } from "../redux/moduls/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useInput();
  const [password, setPassword] = useInput();
  const [cookies, setCookie, removeCookie] = useCookies();

  const goToSignUp = () => {
    navigate("/signup");
  };
  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      //json-server-auth사용
      const { data } = await axios.post(
        `${process.env.REACT_APP_RESISTER_URL}/login`,
        {
          email,
          password,
        }
      );

      console.log(data);
      // setcookie("쿠키 이름", "쿠키 값", 만료시간)
      setCookie("accessToken", data["accessToken"], { path: "/" });
      //redux-toolkit
      dispatch(
        handleUserSlice({
          email,
          password,
          uid: data.user.uid,
          name: data.user.name,
        })
      );
      navigate("/");
    } catch (error) {
      toast.error("아이디 또는 비밀번호를 잘못 입력했습니다.", {
        theme: "colored",
      });
    }
  };

  return (
    <>
      <Navi backgroundColor={false} />
      <Container>
        <FormBox onSubmit={handleLogIn}>
          <h2>Welcome Back!</h2>
          <input
            type="email"
            name="email"
            placeholder="email"
            required
            onChange={setEmail}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            required
            onChange={setPassword}
          />
          <button type="submit">Log In</button>
          <p onClick={goToSignUp}>
            Don't have an account?{" "}
            <span style={{ color: "#F55353" }}>Sign Up!</span>
          </p>
        </FormBox>
      </Container>
    </>
  );
};

export default Login;

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
    margin-bottom: 50px;
    color: #7fd1ae;
  }

  & > input {
    width: 60%;
    height: 40px;
    border: none;
    margin-bottom: 30px;
    border-bottom: 1px solid #7fd1ae;
  }

  & > input:focus {
    outline: none;
  }

  & > button {
    margin-top: 10px;
    padding: 15px 50px;
    border-radius: 5px;
    border: 1px solid transparent;
    background-color: #7fd1ae;
    color: white;
    font-weight: 800;
    cursor: pointer;
  }
  & > button:hover {
    background-color: white;
    border: 1px solid #7fd1ae;
    color: #7fd1ae;
  }

  & > p {
    font-size: 12px;
    color: gray;
    cursor: pointer;
    margin: 0;
    padding: 0;
    position: absolute;
    bottom: 40px;
  }
`;
