import React, { useState, useMemo, useRef } from "react";
import styled from "styled-components";
import Navi from "../components/Navi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import dompurify from "dompurify";

const Write = () => {
  const navigate = useNavigate();
  const { userSlice } = useSelector((state) => state.userSlice);
  const [isLoading, setIsLoading] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies();
  const sanitizer = dompurify.sanitize;
  //react-query
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (newInfo) =>
      await axios.post(`${process.env.REACT_APP_DB_URL}/comments`, newInfo, {
        headers: {
          Authorization: `Bearer ${cookies["accessToken"]}`,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("comments");
      },
      onError: (error) => {
        // 요청에 에러가 발생된 경우
        toast.error("불러오기 실패", {
          theme: "colored",
        });
      },
    }
  );

  //qill
  const [value, setValue] = useState("");
  const quillRef = useRef();

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.addEventListener("change", async (e) => {
      setIsLoading(true);
      const file = input.files[0];
      try {
        const storageRef = ref(storage, file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            toast.error("업로드 실패", {
              theme: "colored",
            });
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                const editor = quillRef.current.getEditor();
                const range = editor.getSelection();
                editor.insertEmbed(range.index, "image", downloadURL);
                editor.setSelection(range.index + 1);
                setIsLoading(false);
              }
            );
          }
        );
      } catch (error) {
        console.log(error);
      }
    });
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ["image"],
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    };
  }, []);

  // 위에서 설정한 모듈들 foramts을 설정한다
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "image",
  ];

  const handleSubmit = () => {
    if (!value) {
      return alert("내용을 입력해주세요");
    } else {
      mutation.mutate({
        content: value,
        uid: userSlice.uid,
        username: userSlice.name,
      });
      setValue("");
      navigate("/");
    }
  };

  return (
    <>
      <Navi boderBottomLine={true} navibackgroundcolor={true}></Navi>
      {isLoading ? (
        <SpinnerContainer>
          <ClipLoader
            className="spinner"
            color="red"
            loading={true}
            size={130}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </SpinnerContainer>
      ) : null}
      <Container>
        <QuillContainer>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={setValue}
            modules={modules}
          />
        </QuillContainer>
        <DisplayContents
          dangerouslySetInnerHTML={{ __html: sanitizer(value) }}
        ></DisplayContents>
        <EditBtn onClick={handleSubmit}>Post</EditBtn>
      </Container>
    </>
  );
};

export default Write;

const SpinnerContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.536);
  z-index: 99999;
`;

const Container = styled.div`
  display: flex;
  margin-top: 50px;
`;

const QuillContainer = styled.div`
  width: 50vw;
  height: 100%;
  min-height: 100vh;
  border-right: 1px solid gray;
  padding: 60px;
`;

const DisplayContents = styled.div`
  width: 50vw;
  height: 100vh;
  padding: 60px;
  height: 100%;
  margin-top: 30px;
`;

const EditBtn = styled.button`
  width: 60px;
  height: 40px;
  padding: 6px;
  border-radius: 5px;
  border: none;
  background-color: #7fd1ae;
  color: white;
  font-weight: 800;
  position: fixed;
  right: 50px;
  bottom: 50px;
  cursor: pointer;
`;
