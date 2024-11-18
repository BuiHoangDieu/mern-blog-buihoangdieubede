import { Button, Modal, Table, TableBody } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";

const DashComment = () => {
  const currentUser = useSelector(
    (state) =>
      state?.user?.user?.currentUser || state?.user?.user?.currentUser?.rest
  );
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/get-all-comments");
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (
      currentUser.isAdmin ||
      currentUser.user?.isAdmin ||
      currentUser.rest?.isAdmin
    ) {
      fetchComments();
    }
  }, [currentUser.rest._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/get-all-comments&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // console.log(comments);

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/delete-comment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setComments((prev) =>
          prev.filter((post) => post._id !== commentIdToDelete)
        );
        // console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-4 border-0 w-full overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-500 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-100 overflow-hidden">
      {(currentUser.user?.isAdmin ||
        currentUser.isAdmin ||
        currentUser?.rest.isAdmin) &&
      comments.length > 0 ? (
        <>
          <Table hoverable className="text-base font-medium shadow-md w-full">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes </Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <>
                <Table.Body key={comment._id}>
                  <Table.Row className="dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell className="font-bold">
                      {comment.content}
                    </Table.Cell>
                    <Table.Cell>{comment.likes.length}</Table.Cell>
                    <Table.Cell>{comment.postId}</Table.Cell>
                    <Table.Cell>{comment.userId}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setCommentIdToDelete(comment._id);
                        }}
                        className="text-red-500 font-medium cursor-pointer hover:underline"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </>
            ))}
          </Table>

          {showMore && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleShowMore}
                className="self-center text-sm px-7"
              >
                Show more
              </Button>
            </div>
          )}
        </>
      ) : (
        <h1>No Comments</h1>
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
              Are you sure you want to delete User?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
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

export default DashComment;
