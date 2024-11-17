import React from "react";
import CallToAction from "../components/CallToAction";
import { useSelector } from "react-redux";

const Projects = () => {
  const theme = useSelector((state) => state.theme.theme);
  return (
    <div
      style={
        theme === "dark"
          ? { backgroundColor: "rgba(16, 23, 42, 1)" }
          : { backgroundColor: "white" }
      }
      className="min-h-screen max-2xl mx-auto flex justify-center items-center flex-col gap-6 p-4"
    >
      <h1 className="text-6xl sm:text-2xl font-semibold">Projects</h1>
      <p>
        Build fun projects with HTML, CSS, JavaScript, Reactjs and Nodejs. Learn
        how to build a full stack application from scratch.
      </p>
      <CallToAction />
    </div>
  );
};

export default Projects;
