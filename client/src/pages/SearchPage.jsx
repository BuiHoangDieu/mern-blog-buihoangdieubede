import { Button, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

const SearchPage = () => {
  const theme = useSelector((state) => state.theme.theme);
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  console.log(sidebarData);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData((prev) => ({
        ...prev,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      }));
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(`/api/post/get-posts?${searchQuery}`);
        if (!res.ok) {
          setLoading(false);
          throw new Error("Failed to fetch posts");
        } else {
          const data = await res.json();
          setPosts(data.posts);
          setLoading(false);
          if (data.posts.length < 7) {
            setShowMore(false);
          } else {
            setShowMore(true);
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleSearchChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData((prev) => ({
        ...prev,
        searchTerm: e.target.value,
      }));
    }

    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData((prev) => ({
        ...prev,
        sort: order,
      }));
    }

    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData((prev) => ({
        ...prev,
        category: category,
      }));
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = fetch(`/api/post/get-posts?${searchQuery}`);
    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    } else {
      const data = res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      if (data.posts.length < 7) {
        setShowMore(false);
      } else {
        setShowMore(true);
      }
    }
  };

  return (
    <div
      className=""
      style={
        theme === "dark"
          ? { backgroundColor: "rgba(16, 23, 42, 1)" }
          : { backgroundColor: "white" }
      }
    >
      <div className="flex flex-col md:flex-row">
        <div
          className="p-2 border-b md:border-r md:min-h-screen
        border-gray-500 min-w-[320px]
      "
        >
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col p-4 gap-6"
          >
            <div className="flex items-center gap-4">
              <label
                className="whitespace-nowrap item-center font-semibold min-w-[100px]"
                htmlFor="searchTerm"
              >
                Search Term
              </label>
              <TextInput
                className="flex-1"
                placeholder="Search"
                id="searchTerm"
                value={sidebarData.searchTerm}
                type="text"
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="whitespace-nowrap font-semibold min-w-[100px]">
                Sort:
              </label>
              <Select
                className="flex-1"
                id="sort"
                onChange={handleSearchChange}
                value={sidebarData.sort}
              >
                <option value="desc">Latest</option>
                <option value="asc">Oldest</option>
              </Select>
            </div>

            <div className="flex items-center gap-4">
              <label className="whitespace-nowrap font-semibold min-w-[100px]">
                Category:
              </label>
              <Select
                className="flex-1"
                id="category"
                onChange={handleSearchChange}
                value={sidebarData.category}
              >
                <option value="uncategorized">Select---</option>
                <option value="python">Python</option>
                <option value="nodejs">NodeJs</option>
                <option value="reactjs">ReactJs</option>
                <option value="nextjs">NextJs</option>
                <option value="javascript">Javscript</option>
              </Select>
            </div>

            <Button
              type="submit"
              gradientDuoTone="purpleToPink"
              outline
              className="w-full"
            >
              Apply Filters
            </Button>
          </form>
        </div>

        {/* Right Side */}
        <div className="w-full">
          <h1 className="w-full lg:text-3xl font-semibold sm:border-b border-gray-500 sm:text-xl p-4 text-center">
            Posts Results:
          </h1>
          <div className="flex flex-wrap gap-4 p-4">
            {!loading && posts.length === 0 && (
              <span className="text-center text-xl font-semibold">
                No post found
              </span>
            )}

            {loading && (
              <span className="text-center text-xl font-semibold">
                Loading...
              </span>
            )}
            {!loading &&
              posts &&
              posts.map((post) => <PostCard key={post._id} post={post} />)}
            {showMore && (
              <Button
                onClick={handleShowMore}
                gradientDuoTone="purpleToPink"
                className="w-full"
              >
                Load More
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
