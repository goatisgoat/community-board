import React, { useState } from "react";
import styled from "styled-components";
import Edit from "./Edit";
import axios from "axios";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import dompurify from "dompurify";
import ClipLoader from "react-spinners/ClipLoader";

const Comments = () => {
  const [updateState, setUpdateState] = useState(-1);
  const { searchSlice } = useSelector((state) => state.homeSlice);
  const { userSlice } = useSelector((state) => state.userSlice);
  const sanitizer = dompurify.sanitize;
  const [cookies, setCookie, removeCookie] = useCookies();

  const { isLoading, isError, data } = useQuery({
    queryKey: ["comments", searchSlice],
    queryFn: () => {
      return axios.get(
        `${process.env.REACT_APP_DB_URL}/comments?_sort=id&_order=desc`,
        {
          headers: {
            Authorization: `Bearer ${cookies["accessToken"]}`,
          },
        },
        { withCredentials: true }
      );
    },
  });

  //edit
  const handleEditState = (id) => {
    setUpdateState(id);
  };
  if (isLoading) {
    return (
      <ClipLoader
        className="spinner"
        color="red"
        loading={true}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );
  }

  if (isError) {
    return <p>오류가 발생하였습니다</p>;
  }

  return (
    <div style={{ marginTop: 100 }}>
      {data?.data.map((item) =>
        item.id === updateState ? (
          <Edit key={item.id} item={item} setUpdateState={setUpdateState} />
        ) : (
          <CommentsContainer key={item.id}>
            {item.uid === userSlice.uid ? (
              <FontSpan>
                <FontAwesomeIcon
                  onClick={() => handleEditState(item.id)}
                  icon={faPenToSquare}
                />
              </FontSpan>
            ) : null}

            <UserImgSpan>
              <div></div>
              <p>{item.username}</p>
            </UserImgSpan>
            <div
              dangerouslySetInnerHTML={{ __html: sanitizer(item.content) }}
            ></div>
          </CommentsContainer>
        )
      )}
    </div>
  );
};

export default Comments;

const CommentsContainer = styled.div`
  max-width: 600px;
  margin-top: 25px;
  padding: 20px;
  border: 1px solid gray;
  border-radius: 10px;
  /* background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px); */
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s;
  position: relative;
  margin-left: 200px;
`;

const FontSpan = styled.span`
  position: absolute;
  right: 10px;
  color: #7fd1ae;
  cursor: pointer;
`;

const UserImgSpan = styled.span`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  & > div {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    margin-right: 10px;
    background-color: #c2ffa6;
  }
`;
