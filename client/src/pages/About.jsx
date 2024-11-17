import React from "react";
import { useSelector } from "react-redux";

const About = () => {
  const theme = useSelector((state) => state.theme.theme);
  return (
    <div
      style={
        theme === "dark"
          ? { backgroundColor: "rgba(16, 23, 42, 1)" }
          : { backgroundColor: "white" }
      }
      className="min-h-screen flex items-center justify-center"
    >
      <div className="max-w-2xl mx-auto">
        <div className="p-8">
          <h1 className="text-3xl sm:text-2xl font-bold text-center mb-8">
            About My Blog
          </h1>
          <div className="text-gray-500 flex flex-col gap-6">
            <p className="text-base">
              This is a blog where you can find a variety of articles and
              tutorials on topics such as web development, software engineering,
              and programing languages.
            </p>
            <p>
              Whether you’re interested in learning JavaScript frameworks,
              mastering Node.js, or understanding the ins and outs of database
              management, our tutorials are designed to help you build
              real-world skills. Join us on this journey, and let’s explore the
              world of coding together!
            </p>
            <p>
              Whether you're here to get started with coding or to deepen your
              expertise, we offer practical, project-based guides that make
              learning efficient and enjoyable. We believe in creating a
              community where developers can learn, grow, and achieve their
              goals in tech. Dive in and discover tutorials that empower your
              journey!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
