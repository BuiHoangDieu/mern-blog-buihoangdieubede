import { Button, Modal, Table, TableBody } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashPosts = () => {
  const currentUser = useSelector(
    (state) =>
      state?.user?.user?.currentUser || state?.user?.user?.currentUser?.rest
  );
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/post/get-posts?userId=${
            currentUser?.user?._id || currentUser?._id || currentUser?.rest?._id
          }`
        );
        // console.log(res);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          // console.log(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    // if (currentUser.isAdmin) {
    //   fetchPosts();
    // }
    fetchPosts();
  }, [currentUser?.user?._id || currentUser?._id || currentUser?.rest?._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/get-posts?userId=${
          currentUser?.user?._id || currentUser?._id || currentUser?.rest?._id
        }&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/delete-post/${postIdToDelete}/${
          currentUser?.user?._id || currentUser?._id || currentUser?.rest?._id
        }`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
        // console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-4 border-0 w-full overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-500 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-100">
      {(currentUser.user?.isAdmin ||
        currentUser.isAdmin ||
        currentUser.rest?.isAdmin) &&
      userPosts.map.length > 0 ? (
        <>
          <Table hoverable className="text-base font-medium shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <>
                <Table.Body>
                  <Table.Row className="dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img
                          crossOrigin="anonymous"
                          src={post.image}
                          alt={post.title}
                          className="w-20  object-cover "
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell className="font-bold">
                      <Link to={`/post/${post.slug}`}>{post.title}</Link>
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                    <Table.Cell>
                      <span
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id);
                        }}
                        className="text-red-500 font-medium cursor-pointer hover:underline"
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/update-post/${post._id}`}>
                        <span className="text-cyan-500 font-medium cursor-pointer hover:underline">
                          Edit
                        </span>
                      </Link>
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
        <h1>No posts</h1>
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
              Are you sure you want to delete Post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
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

export default DashPosts;
