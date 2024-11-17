import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFaliure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const SignIn = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [formData, setFormData] = useState({});
  // const [errorMess, setErrorMess] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  const { isLoading, error: errorMess } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle when user click on sign up button
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Handle when user submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(signInFaliure("Please fill all fields"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFaliure(data.message));
      }
      // setIsLoading(false);
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFaliure(error.message));
      // setErrorMess(error.message);
      // setIsLoading(false);
    }
  };

  // console.log(formData);

  return (
    <div
      className={`min-h-screen py-12 m-auto ${
        theme === "dark" ? "bg-[rgba(16,23,42,1)]" : "bg-white"
      }`}
    >
      <div className="flex p-8 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left side */}
        <div className="flex-1 p-8">
          <Link to="/" className="text-4xl font-bold dark:text-white">
            <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-400 to bg-pink-400 rounded-lg text-white">
              Learn myself
            </span>
          </Link>

          <p className="text-sm mt-8">
            This is demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>

        {/* Right side */}
        <div className="flex-1">
          <form
            action=""
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <div className="">
              <Label value="Email" />
              <TextInput
                onChange={handleOnChange}
                type="email"
                placeholder="email@gmail.com"
                id="email"
              />
            </div>

            <div className="">
              <Label value="Password" />
              <TextInput
                onChange={handleOnChange}
                type="password"
                placeholder="Password"
                id="password"
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-4">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>

          <div className="mt-8 flex gap-2 text-sm">
            <span>You don't have account</span>
            <Link to="/sign-up" className="text-blue-500">
              {" "}
              Sign Up
            </Link>
          </div>

          {errorMess && (
            <Alert className="font-bold mt-4" color="failure">
              {errorMess}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
