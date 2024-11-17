import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import hljs from "highlight.js";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase.js";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

hljs.configure({
  // optionally configure hljs
  languages: ["javascript", "ruby", "python"],
});

const UpdatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadPrgress, setImageUploadPrgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  // const [formData, setFormData] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    category: "uncategorized",
    image: "",
    content: "",
    _id: null, // If needed for post update
    userId: null, // If needed for post update
  });
  const [pushlishError, setPublishError] = useState(null);
  const { postId } = useParams();
  // console.log(postId);

  const theme = useSelector((state) => state.theme.theme);
  const navigate = useNavigate();

  console.log(formData);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleCategoryChange = (e) => {
    setFormData((prevState) => ({ ...prevState, category: e.target.value }));
  };

  const handleQuillChange = (value) => {
    setFormData((prevState) => ({ ...prevState, content: value }));
  };

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/get-posts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        } else {
          setPublishError(null);
          const post = data.posts[0];
          setFormData({
            ...post,
            title: post.title || "",
            category: post.category || "uncategorized",
            content: post.content || "",
            image: post.image || "",
            _id: post._id,
            userId: post.userId,
          });
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error);
    }
  }, [postId]);

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

  // const handleSubmitUpdatePost = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await fetch(
  //       `/api/post/update-post/${formData._id}/${formData.userId}`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(formData),
  //       }
  //     );

  //     const data = await res.json();
  //     if (!res.ok) {
  //       setPublishError(data.message);
  //       return;
  //     } else {
  //       setPublishError(null);
  //       navigate(`/post/${data.slug}`);
  //       console.log(data);
  //     }
  //   } catch (error) {
  //     setPublishError("Failed to create post");
  //   }
  // };
  const handleSubmitUpdatePost = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.category) {
      setPublishError("All fields are required!");
      return;
    }

    try {
      const res = await fetch(
        `/api/post/update-post/${formData._id}/${formData.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

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
      setPublishError("Failed to update post");
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
          Update a post
        </h1>
        <form onSubmit={handleSubmitUpdatePost} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <TextInput
              className="flex-1"
              type="text"
              placeholder="Title"
              required
              id="title"
              onChange={handleInputChange}
              value={formData.title}
            />
            <Select onChange={handleCategoryChange} value={formData.category}>
              <option value="uncategorized">Select a category</option>
              <option value="javascript">Javascript</option>
              <option value="reactjs">Reactjs</option>
              <option value="nodejs">Nodejs</option>
              <option value="htmlcss">Html & Css</option>
              <option value="python3">Python & Data</option>
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
            placeholder="Write some thing"
            color="gray"
            onChange={handleQuillChange}
            value={formData.content}
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
          />
          <Button gradientDuoTone="purpleToPink" type="submit">
            Update Post
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

export default UpdatePost;
