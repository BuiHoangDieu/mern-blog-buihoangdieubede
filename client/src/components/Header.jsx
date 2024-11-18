import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  Navbar,
  TextInput,
} from "flowbite-react";
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/user/userSlice";
import { MdLightMode } from "react-icons/md";

const Header = () => {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(
    (state) => state.user.user || state.user.user.rest
  );
  const { theme } = useSelector((state) => state.theme);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = React.useState("");

  // console.log(searchTerm);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/sign-out/", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(
          data?.message || "Sign-out failed: endpoint not found or server error"
        );
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar className="border-b-2">
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-bold dark:text-white"
        >
          <span className="px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-400 to bg-pink-400 rounded-lg text-white">
            Learn myself
          </span>
        </Link>

        <form
          onSubmit={handleSearch}
          className="flex flex-row items-center justify-center"
        >
          <TextInput
            placeholder="Search..."
            type="text"
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
          <AiOutlineSearch />
        </Button>

        <div className="flex items-center gap-2 md:order-2">
          <Button
            className="w-8 h-8"
            color="gray"
            pill
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === "dark" ? <FaMoon /> : <MdLightMode />}
          </Button>

          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="avatar"
                  crossOrigin="anonymous"
                  src={
                    currentUser.profilePicture ||
                    currentUser.rest.profilePicture
                  }
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">
                  {currentUser.username || currentUser.rest.username}
                </span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email || currentUser.rest.email}
                </span>
              </Dropdown.Header>

              <Link to="/dashboard?tab=profile">
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignOut}> Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to="/sign-in">
              <Button className="" outline gradientDuoTone="purpleToBlue">
                Sign In
              </Button>
            </Link>
          )}
          <Navbar.Toggle />
        </div>

        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
            <Link to="/">Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={"div"}>
            <Link to="/about">About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/projects"} as={"div"}>
            <Link to="/projects">My Project</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
