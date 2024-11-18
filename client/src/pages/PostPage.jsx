import { Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

const PostPage = () => {
  const theme = useSelector((state) => state.theme.theme);
  const { postSlug } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  // console.log(post);

  // console.log(recentPosts);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/post/get-posts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message);
          setIsLoading(false);
          return;
        } else {
          setPost(data.posts[0]);
          setIsLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPost = async () => {
        const res = await fetch("/api/post/get-posts?limit=3");
        const data = await res.json();
        if (!res.ok) {
          console.error(data.message);
          return;
        } else {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPost();
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div
      style={
        theme === "dark"
          ? { backgroundColor: "rgba(16, 23, 42, 1)" }
          : { backgroundColor: "white" }
      }
    >
      <main className="flex flex-col p-4 max-w-6xl mx-auto min-h-screen">
        <h1 className="text-3xl mt-10 p-4 text-center max-w-2xl mx-auto lg:text-4xl">
          {post && post.title}
        </h1>
        <Link
          to={`/search?category=${post && post.category}`}
          className="self-center"
        >
          <button
            color="gray"
            size="sm"
            className="text-teal-500 border border-teal-500 rounded-md px-4 py-1 mt-4"
          >
            {post && post.category}
          </button>
        </Link>
        <div>
          <img
            crossOrigin="anonymous"
            src={post && post.image}
            alt={post && post.title}
            className="max-w-[600px] max-h-[400px] object-cover mt-4 mx-auto"
          />
        </div>
        <div className=" flex justify-between p-4 border-b border-slate-500 mx-auto text-sm w-full max-w-2xl">
          <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          <span>
            {post && (post.content.length / 1000).toFixed(0)} mins read
          </span>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: post && post.content }}
          className="p-4 max-w-2xl mx-auto w-full post-content"
        ></div>

        <div className="max-4-xl mx-auto">
          <CallToAction />
        </div>
        <div>
          <CommentSection postId={post._id} />
        </div>

        <div className="flex flex-col items-center justify-center mb-5">
          <h1 className="text-3xl text-center py-4 mb-4">Recent Articles</h1>
          <div className="flex flex-wrap gap-5 justify-center">
            {recentPosts &&
              recentPosts.length > 0 &&
              recentPosts.map((recentPost) => (
                <PostCard key={recentPost._id} post={recentPost} />
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostPage;
