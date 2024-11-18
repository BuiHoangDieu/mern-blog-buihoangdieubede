import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocument,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashboardComponent = () => {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalcomments, setTotalComments] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  const { currentUser } = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`/api/user/get-users?limit=5`);
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUsers(data.listUser);
        setTotalUsers(data.totalUsers);
      }
    };

    const fetchComments = async () => {
      const res = await fetch(`/api/comment/get-all-comments?limit=5`);
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setComments(data.comments);
        setTotalComments(data.totalComment);
      }
    };

    const fetchPosts = async () => {
      const res = await fetch(`/api/post/get-posts?limit=5`);
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
      }
    };
    if (currentUser.rest.isAdmin) {
      fetchUsers();
      fetchComments();
      fetchPosts();
    }
  }, [currentUser.rest]);

  return (
    <div className="p-3 md:mx-auto">
      <div className="flex gap-4 flex-wrap justify-center">
        <div className=" flex flex-col p-4 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className=" flex justify-between">
            <div className="">
              <h3 className="text-gray-500 font-medium">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="h-10 w-10 text-white bg-teal-500 rounded-full p-2" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp className="h-5 w-5 text-green-500" />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>

        {/* Comment */}
        <div className=" flex flex-col p-4 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className=" flex justify-between">
            <div className="">
              <h3 className="text-gray-500 font-medium">Total Comments</h3>
              <p className="text-2xl">{totalcomments}</p>
            </div>
            <HiAnnotation className="h-10 w-10 text-white bg-blue-500 rounded-full p-2" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp className="h-5 w-5 text-green-500" />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>

        {/* Post */}
        <div className=" flex flex-col p-4 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className=" flex justify-between">
            <div className="">
              <h3 className="text-gray-500 font-medium">Total Posts</h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <HiDocumentText className="h-10 w-10 text-white bg-lime-500 rounded-full p-2" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp className="h-5 w-5 text-green-500" />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent users</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        crossOrigin="anonymous"
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Comments</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=comments-manager"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body key={comment._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{comment.content}</Table.Cell>
                    <Table.Cell>
                      {comment.numberOfLieks ? comment.numberOfLieks : 0}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Posts</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=posts"}>See all</Link>
            </Button>
          </div>
          <Table hoverable className="">
            <Table.Head>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body key={post._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt="post"
                        className="w-10 h-10 rounded-sm bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="line-clamp-2 w-96">
                      {post.title}
                    </Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
