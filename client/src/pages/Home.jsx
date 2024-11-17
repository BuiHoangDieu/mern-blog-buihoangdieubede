import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";

const Home = () => {
  const theme = useSelector((state) => state.theme.theme);
  const [posts, setPosts] = useState([]);

  console.log(posts);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch("api/post/get-posts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPost();
  }, []);

  return (
    <div
      style={
        theme === "dark"
          ? { backgroundColor: "rgba(16, 23, 42, 1)" }
          : { backgroundColor: "white" }
      }
    >
      <div className="flex flex-col items-center justify-center gap-6 p-24">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-base sm:text-sm">
          Here you'll find a cariety of articles and tutorials on topics such as
          web development, software engineering, and programing languages.
        </p>
        <Link
          to={"/search"}
          className="sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>

      <div className="p-4 mx-auto bg-amber-100">
        <CallToAction />
      </div>

      <div className="max-w-6xl mx-auto p-4 flex flex-col gap-4 py-8">
        {posts && posts.length > 0 && (
          <div className="">
            <h1 className="text-3xl font-bold sm:text-2xl text-center">
              Recent Posts
            </h1>
            <div className="flex flex-wrap justify-center gap-6 mx-auto">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}
        <Link
          to={"/search"}
          className="sm:text-sm text-center text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>
    </div>
  );
};

export default Home;
