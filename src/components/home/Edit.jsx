import React, { useState, useMemo, useRef } from "react";
import styled from "styled-components";
import Button from "../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQueryClient } from "react-query";
import { storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Edit = ({ item, setUpdateState }) => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const { userSlice } = useSelector((state) => state.userSlice);
  //qill
  const [value, setValue] = useState(item.content);
  const quillRef = useRef();

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.addEventListener("change", async (e) => {
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
            toast.error("error!");
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log(downloadURL, "downloadURL");
                const editor = quillRef.current.getEditor();
                const range = editor.getSelection();
                editor.insertEmbed(range.index, "image", downloadURL);
                editor.setSelection(range.index + 1);
              }
            );
          }
        );
      } catch (error) {
        toast.error("error!");
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

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "image",
  ];

  //react-query
  const queryClient = useQueryClient();
  const editMutation = useMutation(
    (editInfo) => {
      return axios.patch(
        `${process.env.REACT_APP_DB_URL}/comments/${item.id}`,
        editInfo,
        {
          headers: {
            Authorization: `Bearer ${cookies["accessToken"]}`,
          },
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("comments");
      },
    }
  );

  const deleteMutation = useMutation(
    () => {
      return axios.delete(
        `${process.env.REACT_APP_DB_URL}/comments/${item.id}`,
        {
          headers: {
            Authorization: `Bearer ${cookies["accessToken"]}`,
          },
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("comments");
      },
    }
  );

  //삭제
  const handleDelete = () => {
    const deletePostConfirm = window.confirm("삭제하시겠습니까?");
    if (deletePostConfirm) {
      deleteMutation.mutate();
    }
  };

  //edit
  const handleSubmit = () => {
    if (!value) {
      return toast.warning("내용을 입력해주세요");
    } else {
      setValue("");
      editMutation.mutate({ content: value, uid: userSlice.uid });
      handleEditState();
    }
  };

  const handleEditState = () => {
    setUpdateState(-1);
  };

  return (
    <CommentsContainer>
      <FontSpan>
        <FontAwesomeIcon onClick={handleEditState} icon={faRotateLeft} />
      </FontSpan>
      <UserImgSpan>
        <div></div>
        <p>name</p>
      </UserImgSpan>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
      />

      <BtnDiv>
        <Button onClick={handleDelete}>delete</Button>
        <Button onClick={handleSubmit}>Edit</Button>
      </BtnDiv>
    </CommentsContainer>
  );
};

export default Edit;

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
  & > div {
    width: 30px;
    height: 30px;
    border-radius: 30px;
    margin-right: 10px;
    background-color: #c2ffa6;
  }
`;

const BtnDiv = styled.div`
  display: flex;
  justify-content: end;
`;
