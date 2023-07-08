import React, { useState, useMemo, useRef } from "react";
import styled from "styled-components";
import Navi from "../components/Navi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addComments } from "../api/comments";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const Write = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  //react-query
  const queryClient = useQueryClient();
  const mutation = useMutation(addComments, {
    onSuccess: () => {
      queryClient.invalidateQueries("comments");
    },
  });

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
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log(downloadURL, "downloadURL");
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
      mutation.mutate({ content: value });
      setValue("");
      navigate("/");
    }
  };

  return (
    <>
      <Navi />
      {isLoading ? (
        <ClipLoader
          className="spinner"
          color="red"
          loading={true}
          // cssOverride={}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
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
          dangerouslySetInnerHTML={{ __html: value }}
        ></DisplayContents>
        <EditBtn onClick={handleSubmit}>Post</EditBtn>
      </Container>
    </>
  );
};

export default Write;

const Container = styled.div`
  display: flex;
  margin-top: 100px;
`;

const QuillContainer = styled.div`
  width: 50vw;
  height: 100%;
  min-height: 100vh;
  border-right: 1px solid gray;
  padding: 30px;
`;

const DisplayContents = styled.div`
  width: 50vw;
  height: 100vh;
  padding: 30px;
  height: 100%;
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
