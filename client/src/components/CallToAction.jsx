import { Button } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";

const CallToAction = () => {
  const theme = useSelector((state) => state.theme.theme);
  return (
    <div
      style={
        theme === "dark"
          ? { backgroundColor: "rgba(16, 23, 42, 1)" }
          : { backgroundColor: "white" }
      }
      className="p-4 mx-auto max-w-[800px] flex  flex-col justify-between items-center sm:flex-row rounded-tl-3xl rounded-br-3xl border border-teal-500"
    >
      <div className="flex justify-center flex-col gap-2">
        <h2>Want to learn more about Fullstack Web Development?</h2>
        <p className="text-center">Checkout these resources </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-sm rounded-br-sm"
        >
          <a href="https://fullstack.edu.vn" target="_blank">
            Fullstack.edu.vn
          </a>
        </Button>
      </div>
      <div className="p-6">
        <img
          crossOrigin="anonymous"
          src="https://files.fullstack.edu.vn/f8-prod/courses/13/13.png"
        />
      </div>
    </div>
  );
};

export default CallToAction;
