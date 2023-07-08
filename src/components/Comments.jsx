import React, { useState } from "react";
import styled from "styled-components";
import { useQuery } from "react-query";
import Edit from "./Edit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useSelector } from "react-redux";
import dompurify from "dompurify";
import ClipLoader from "react-spinners/ClipLoader";
import { getComments } from "../api/comments";

const Comments = () => {
  const [updateState, setUpdateState] = useState(-1);
  const { searchSlice } = useSelector((state) => state.homeSlice);
  const sanitizer = dompurify.sanitize;

  // const { isLoading, isError, data } = useQuery({
  //   queryKey: ["comments", searchSlice],
  //   queryFn: () => {
  //     return axios.get(`http://localhost:3001/comments?_sort=id&_order=desc`);
  //   },
  // });

  const { isLoading, isError, data } = useQuery("comments", getComments);

  console.log(data);

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
        // cssOverride={}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    );
  }

  if (isError) {
    return <p>오류가 발생하였습니다...!</p>;
  }

  return (
    <div style={{ marginTop: 100 }}>
      {data?.data.map((item) =>
        item.id === updateState ? (
          <Edit key={item.id} item={item} setUpdateState={setUpdateState} />
        ) : (
          <CommentsContainer key={item.id}>
            <FontSpan>
              <FontAwesomeIcon
                onClick={() => handleEditState(item.id)}
                icon={faPenToSquare}
              />
            </FontSpan>
            <UserImgSpan>
              <div></div>
              <p>name</p>
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
