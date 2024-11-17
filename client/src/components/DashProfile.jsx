import { Alert, Button, Modal, ModalBody, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
  updateStart,
  updateError,
  updateSuccess,
  deleteStart,
  deleteSuccess,
  deleteError,
  signOutError,
  signOutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

const DashProfile = () => {
  // const { currentUser, isLoading } = useSelector((state) => state.user.user);

  const currentUser = useSelector(
    (state) =>
      state?.user?.user?.currentUser || state?.user?.user?.currentUser?.rest
  );

  const isLoading = useSelector((state) => state.user.user.isLoading);
  // console.log(isLoading);
  // console.log(currentUser);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState();
  const [imageFileUploadError, setImageFileUploadError] = useState();
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({});

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  // console.log(imageFileUploadProgress, imageFileUploadError);
  // console.log(imageFile, imageFileUrl);
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    // service firebase.storage {
    //     match /b/{bucket}/o {
    //       match /{allPaths=**} {
    //         allow read;
    //         allow write: if
    //         request.resource.size < (2 * 1024 * 1024) &&
    //         request.resource.contentType.matches('image/.*')
    //       }
    //     }
    //   }
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const imageStorage = getStorage(app);
    const fileName = new Date().getTime() + "-" + imageFile.name;
    const imageStogeRef = ref(imageStorage, fileName);
    const uploadTask = uploadBytesResumable(imageStogeRef, imageFile);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("File must be less then 2MB");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChangeUpdate = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // console.log(formData);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("Error: No data to update");
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError("Error: Image is uploading");
      return;
    }
    try {
      dispatch(updateStart());
      // const userId = currentUser?.user?._id || currentUser?._id;
      // console.log(userId);
      const res = await fetch(
        `api/user/update/${
          currentUser?.user?._id || currentUser?._id || currentUser?.rest?._id
        }`,
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
        dispatch(updateError(data.message));
        setUpdateUserError("User update failed");
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User updated successfully");
      }
    } catch (error) {
      dispatch(updateError(error.message));
      setUpdateUserError("User update failed");
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteStart());
      const res = await fetch(
        `api/user/delete/${
          currentUser?.user?._id || currentUser?._id || currentUser?.rest?._id
        }`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteError(data.message));
      } else {
        dispatch(deleteSuccess(data));
        setUpdateUserSuccess("User updated successfully");
      }
    } catch (error) {
      dispatch(deleteError(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("api/user/sign-out/", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="mb-8 text-2xl font-bold text-gray-800 text-center">
        My Profile
      </h1>
      <form onSubmit={handleUpdateUser} className="flex flex-col gap-4">
        <input
          type="file"
          id="profilePicture"
          onChange={handleChangeImage}
          ref={filePickerRef}
          hidden
          accept="image/.*"
        />
        <div
          onClick={() => filePickerRef.current.click()}
          className="relative w-[80px] h-[80px] self-center"
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 255, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={
              imageFileUrl ||
              currentUser?.user?.profilePicture ||
              currentUser?.profilePicture ||
              currentUser?.rest?.profilePicture
            }
            alt="profile"
            className="cursor-pointer w-full h-full rounded-full border-4 object-contains border-blue-200"
          />
        </div>

        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <TextInput
          onChange={handleChangeUpdate}
          type="text"
          placeholder="username"
          id="username"
          defaultValue={
            currentUser?.user?.username ||
            currentUser?.username ||
            currentUser?.rest?.username
          }
        />
        <TextInput
          onChange={handleChangeUpdate}
          type="text"
          placeholder="email"
          id="email"
          defaultValue={
            currentUser.user?.email ||
            currentUser.email ||
            currentUser.rest?.email
          }
        />
        <TextInput
          onChange={handleChangeUpdate}
          type="Password"
          placeholder="password"
          id="password"
          defaultValue="**************"
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          outline
          disabled={isLoading || imageFileUploading}
        >
          {isLoading ? "Loading..." : "Update"}
        </Button>
        {currentUser.user?.isAdmin ||
          currentUser.isAdmin ||
          (currentUser.rest?.isAdmin === true && (
            <Link to={"/create-post"}>
              <Button
                type="button"
                className="w-full"
                gradientDuoTone="cyanToBlue"
                outline
              >
                Create a post
              </Button>
            </Link>
          ))}
      </form>
      <div className="flex justify-between mt-8">
        <Button
          type="button"
          // className="text-red-500"
          gradientDuoTone="redToYellow"
          outline
          onClick={() => setShowModal(true)}
        >
          Delete Account
        </Button>
        <Button
          onClick={handleSignOut}
          type="button"
          gradientDuoTone="greenToBlue"
          outline
        >
          Sign Out
        </Button>
      </div>

      {updateUserSuccess && (
        <Alert color="success" className="mt-4">
          {updateUserSuccess}
        </Alert>
      )}

      {updateUserError && (
        <Alert color="failure" className="mt-4">
          {updateUserError}
        </Alert>
      )}

      <Modal
        show={showModal}
        size="md"
        onClose={() => setShowModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
