import React, { useState, useMemo, useRef } from "react";
import styled from "styled-components";
import { addComments } from "../api/comments";
import { useMutation, useQueryClient } from "react-query";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const UserInputModal = () => {
  //react-query
  const queryClient = useQueryClient();
  const mutation = useMutation(addComments, {
    onSuccess: () => {
      queryClient.invalidateQueries("comments");
    },
  });

  //quill
  const [value, setValue] = useState("");
  const quillRef = useRef();

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.addEventListener("change", async (e) => {
      const file = input.files[0];
      console.log(file);
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const file = e.target[0].files[0];
  //   try {
  //     const storageRef = ref(storage, e.target[1].value);
  //     const uploadTask = uploadBytesResumable(storageRef, file);

  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         console.log("Upload is " + progress + "% done");
  //         switch (snapshot.state) {
  //           case "paused":
  //             console.log("Upload is paused");
  //             break;
  //           case "running":
  //             console.log("Upload is running");
  //             break;
  //         }
  //       },
  //       (error) => {
  //         console.log(error);
  //       },
  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
  //           console.log(downloadURL, "downloadURL");
  //           mutation.mutate({ content: e.target[1].value, img: downloadURL });
  //         });
  //       }
  //     );
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  return (
    <BackgroundModal>
      <InnerModal>
        {/* <InnerBrowser>write</InnerBrowser> */}
        <InnerInput>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value}
            onChange={setValue}
            modules={modules}
          />
          {/* <div>{value}</div> */}
        </InnerInput>
      </InnerModal>
    </BackgroundModal>
  );
};

export default UserInputModal;

const BackgroundModal = styled.div`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const InnerModal = styled.div`
  width: 700px;
  height: 500px;
  border-radius: 5px;
  background-color: white;
  overflow: scroll;
`;
const InnerBrowser = styled.div`
  height: 50px;
  width: 90%;
  margin: 0 auto;
  /* background-image: url("https://user-images.githubusercontent.com/129598273/251397076-b294b5b7-f850-49da-a810-59406944f687.png");
  background-position: center;
  background-size: cover;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px; */
  border-bottom: 1px solid gray;
`;

const InnerInput = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  & > form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
const LableDiv = styled.div`
  width: 300px;
  height: 200px;
  border: 1px solid gray;
  border-radius: 20px;
  background-color: #cac3c3;
  position: relative;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;

  & > label {
    width: 100%;
    height: 100%;
    position: absolute;
    cursor: pointer;
  }

  /* & > button {
    padding: 15px 20px;
    border-radius: 15px;
    border: none;
    background-color: #7fd1ae;
    color: white;
    font-weight: 800;
  } */
`;

const ModalTextarea = styled.textarea`
  resize: none;
  width: 500px;
  height: 200px;
`;
