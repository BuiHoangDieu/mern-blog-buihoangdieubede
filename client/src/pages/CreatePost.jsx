import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import hljs from "highlight.js";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase.js";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";
import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/monokai-sublime.min.css";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

hljs.configure({
  // optionally configure hljs
  languages: ["javascript", "ruby", "python"],
});

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadPrgress, setImageUploadPrgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [pushlishError, setPublishError] = useState(null);

  function removeVietnameseTones(str) {
    return str
      .normalize("NFD") // Tách các dấu ra khỏi ký tự
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu
      .replace(/đ/g, "d") // Thay thế "đ" thành "d"
      .replace(/Đ/g, "D") // Thay thế "Đ" thành "D"
      .replace(/[^a-zA-Z0-9 ]/g, ""); // Loại bỏ các ký tự đặc biệt nếu cần
  }

  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.theme);

  const handelUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image to upload");
        return;
      } else {
        setImageUploadError(null);
        const fileStorage = getStorage(app);
        const fileName = new Date().getTime() + "-" + file.name;
        const fileStorageRef = ref(fileStorage, fileName);
        const uploadTask = uploadBytesResumable(fileStorageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageUploadPrgress(progress.toFixed(0));
          },
          (error) => {
            setImageUploadError("Image upload failed");
            setImageUploadPrgress(null);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageUploadPrgress(null);
              setImageUploadError(null);
              setFormData({ ...formData, image: downloadURL });
            });
            console.log("upload completed");
          }
        );
      }
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadPrgress(null);
      console.log(error);
    }
  };

  const handleSubmitCreatePost = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
        console.log(data);
      }
    } catch (error) {
      setPublishError("Failed to create post");
    }
  };

  return (
    <div
      style={
        theme === "dark"
          ? { backgroundColor: "rgba(16, 23, 42, 1)" }
          : { backgroundColor: "white" }
      }
    >
      <div className="p-4 max-w-3xl mx-auto min-h-screen">
        <h1 className="mb-4 text-center text-3xl font-Robobo font-bold">
          Create a post
        </h1>
        <form onSubmit={handleSubmitCreatePost} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <TextInput
              className="flex-1"
              type="text"
              placeholder="Title"
              required
              id="title"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Select
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
              }}
            >
              <option value="uncategorized">Select a category</option>
              <option value="javascript">Javascript</option>
              <option value="reactjs">Reactjs</option>
              <option value="nodejs">Nodejs</option>
              <option value="htmlcss">Html & Css</option>
              <option value="python3">Python & Data</option>
              <option value="streamlit">Streamlit</option>
            </Select>
          </div>
          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-2">
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button
              onClick={handelUploadImage}
              gradientDuoTone="purpleToPink"
              type="button"
              outline
              disabled={imageUploadPrgress}
            >
              {imageUploadPrgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar
                    text={`${imageUploadPrgress || 0}%`}
                    value={imageUploadPrgress}
                  />
                </div>
              ) : (
                "Upload image"
              )}
            </Button>
          </div>
          {imageUploadError && (
            <Alert className="mt-4" color="failure" type="error">
              {imageUploadError}
            </Alert>
          )}
          {formData.image && (
            <img
              src={formData.image}
              alt="uploaded"
              className="w-72 object-cover mx-auto"
            />
          )}
          <ReactQuill
            className="dark:text-gray-50 h-72 mb-12"
            theme="snow"
            required
            modules={{
              syntax: true,
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["bold", "italic", "underline"],
                ["blockquote", "code-block"],
                ["link", "image", "video", "formula"],
              ],
            }}
            placeholder="Write something here..."
            onChange={(value) => {
              setFormData({ ...formData, content: value });
            }}
          />
          <Button gradientDuoTone="purpleToPink" type="submit">
            Publish
          </Button>

          {pushlishError && (
            <Alert className="mt-4" color="failure" type="error">
              {pushlishError}
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
