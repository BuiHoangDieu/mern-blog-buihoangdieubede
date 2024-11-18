import { Alert, Button, Modal, Textarea, TextInput } from "flowbite-react";
import { list } from "postcss";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const CommentSection = (postId) => {
  const currentUser = useSelector(
    (state) =>
      state?.user?.user?.currentUser || state?.user?.user?.currentUser?.rest
  );
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [listComments, setListComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);

  // console.log(listComments);
  const postIdQuery = postId.postId;
  console.log(postIdQuery);
  const navigate = useNavigate();

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      if (comment.length > 200 || comment.length < 10) {
        setCommentError("Comment is between 10 and 200 characters.");
        return;
      } else {
        const res = await fetch("/api/comment/create-comment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser?.rest._id,
            ...postId,
            content: comment,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setCommentError(data.message);
          return;
        } else {
          setComment("");
          setCommentError(null);
          setListComments([data, ...listComments]);
        }
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/get-comments/${postIdQuery}`);
        if (!res.ok) {
          // setCommentError("Failed to fetch comments.");
          return;
        } else {
          const data = await res.json();
          setListComments(data);
        }
      } catch (error) {
        setCommentError(error.message);
      }
    };
    getComments();
  }, [postIdQuery]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser && !currentUser.rest) {
        navigate("/sign-in");
      } else {
        const res = await fetch(`/api/comment/like-comment/${commentId}`, {
          method: "PUT",
        });
        if (!res.ok) {
          setCommentError("Failed to like comment.");
          return;
        } else {
          const data = await res.json();
          console.log(data);
          // setComment((listComments) => {
          //   return comment._id === commentId
          //     ? {
          //         ...comment,
          //         likes: data.likes,
          //         numberOfLikes: data.numberOfLikes.length,
          //       }
          //     : {
          //         ...comment,
          //       };
          // });
          setListComments((prevComments) =>
            prevComments.map((comment) =>
              comment._id === commentId
                ? {
                    ...comment,
                    likes: data.likes,
                    numberOfLikes: data.numberOfLikes,
                  }
                : {
                    ...comment,
                  }
            )
          );
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditComment = async (comment, editedComment) => {
    setListComments((prevComments) =>
      prevComments.map((c) =>
        c._id === comment._id ? { ...c, content: editedComment } : c
      )
    );
  };

  const handleDeleteComment = async (commentId) => {
    try {
      if (!currentUser && !currentUser.rest) {
        navigate("/sign-in");
      } else {
        const res = await fetch(`/api/comment/delete-comment/${commentId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          setCommentError("Failed to delete comment.");
          return;
        } else {
          const data = await res.json();
          setListComments((prevComments) =>
            prevComments.filter((comment) => comment._id !== commentId)
          );

          setShowModal(false);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto p-4">
      {currentUser && currentUser.rest ? (
        <div className="flex items-center gap-1 my-5 text-gray-500">
          <p className="text-sm mr-4">
            Signed in as {currentUser.rest.username}
          </p>
          <img
            crossOrigin="anonymous"
            className="w-4 h-4 object-cover rounded-full"
            src={currentUser.rest.profilePicture}
            alt="profile"
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-cyan-500 hover:underline"
          >
            @{currentUser.rest.username}
          </Link>
        </div>
      ) : (
        <div className="flex text-sm text-teal-700">
          <p>Sign in to comment.</p>
          <Link to={"/sign-in"}>
            <span className="m-4 text-blue-500 hover:underline">Sign in</span>
          </Link>
        </div>
      )}

      {currentUser && currentUser.rest && (
        <form
          onSubmit={handleComment}
          className="border border-teal-500 p-4 border-bl-3xl"
        >
          <Textarea
            className="w-full"
            placeholder="Add a comment..."
            rows={3}
            maxLength={200}
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="bg-cyan-500 text-white text-sm px-4 py-1 text-center rounded-md mt-4"
          >
            Comment
          </button>
          {commentError && (
            <Alert color="failure" className="mt-5">
              {commentError}
            </Alert>
          )}
        </form>
      )}

      {listComments.length === 0 ? (
        <polygon className="text-gray-500">No comments yet.</polygon>
      ) : (
        <>
          <div className="flex items-center mt-8">
            <p className="text-gray-500 mr-4">Comments</p>
            <div className="border border-gray-400 px-2 text-sm rounded-sm">
              {listComments.length}
            </div>
          </div>
          {listComments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEditComment}
              onDeleteComment={(commentId) => {
                setShowModal(true);
                setCommentIdToDelete(commentId);
              }}
            />
          ))}
        </>
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
              Are you sure you want to delete comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDeleteComment(commentIdToDelete)}
              >
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

export default CommentSection;
