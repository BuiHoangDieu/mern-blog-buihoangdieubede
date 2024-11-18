import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment/moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";

const Comment = ({ comment, onLike, onEdit, onDeleteComment }) => {
  const { currentUser } = useSelector((state) => state.user.user);
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        const data = await res.json();
        if (!res.ok) {
          console.error(data.message);
          return;
        } else {
          setUser(data);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setEditing(true);
    setEditedComment(comment.content);
  };

  const handleSaveEditedComment = async () => {
    try {
      const res = await fetch(`/api/comment/edit-comment/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editedComment,
        }),
      });
      if (!res.ok) {
        console.error(res.message);
        return;
      } else {
        onEdit(comment, editedComment);
        setEditing(false);
        editedComment("");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          crossOrigin="anonymous"
          className="w-10 h-10 rounded-full bg-gray-200"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        {editing ? (
          <>
            <Textarea
              className="w-full p-2 border rounded-lg"
              defaultValue={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
            />
            <div className="flex flex-end justify-end gap-2 mt-2">
              <Button
                onClick={() => handleSaveEditedComment()}
                type="button"
                gradientDuoTone="purpleToPink"
                size="sm"
              >
                Save
              </Button>
              <Button
                onClick={() => setEditing(false)}
                type="button"
                color="gray"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="">{comment.content}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className={`hover:text-blue-500 ${
                  currentUser.rest &&
                  comment.likes.includes(currentUser.rest._id)
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
                onClick={() => onLike(comment._id)}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p>
                {comment.numberOfLikes}{" "}
                {comment.numberOfLikes === 1 ? "like" : "likes"}
              </p>
              {currentUser.rest &&
                (currentUser.rest._id === comment.userId ||
                  currentUser.rest.isAdmin) && (
                  <>
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="text-gray-500 hover:text-blue-300"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteComment(comment._id)}
                      className="text-gray-500 hover:text-blue-300"
                    >
                      Delete
                    </button>
                  </>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
Comment.propTypes = {
  comment: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
};

export default Comment;
