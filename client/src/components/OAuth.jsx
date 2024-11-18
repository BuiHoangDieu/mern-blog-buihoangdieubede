import { Button } from "flowbite-react";
import React from "react";
import { AiOutlineGoogle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess, signInFaliure } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle when user click on google button
  const handelGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultFormGoogle = await signInWithPopup(auth, provider);
      console.log(resultFormGoogle);
      const res = await fetch("/api/auth/google-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: resultFormGoogle.user.displayName,
          email: resultFormGoogle.user.email,
          googlePhotoUrl: resultFormGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFaliure(error.message));
    }
  };

  return (
    <Button
      gradientDuoTone="pinkToOrange"
      className=""
      type="button"
      outline
      onClick={handelGoogleClick}
    >
      <AiOutlineGoogle className="mr-2 w-6 h-6" />
      Continute with Google
    </Button>
  );
};

export default OAuth;
