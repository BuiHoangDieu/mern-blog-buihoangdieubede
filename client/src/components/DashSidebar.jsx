import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiArrowSmRight,
  HiChartPie,
  HiDocument,
  HiDocumentText,
  HiShoppingBag,
  HiUser,
  HiUserGroup,
} from "react-icons/hi";
import { useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice";
import { useSelector } from "react-redux";
import { FaCommentAlt } from "react-icons/fa";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const currentUser = useSelector(
    (state) =>
      state?.user?.user?.currentUser || state?.user?.user?.currentUser?.rest
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");

    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch("api/user/sign-out/", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser.user?.isAdmin ||
            currentUser.isAdmin ||
            (currentUser.rest?.isAdmin === true && (
              <Link to="/dashboard?tab=dashboard-manager">
                <Sidebar.Item
                  href="#"
                  icon={HiChartPie}
                  active={tab === "dashboard-manager" || !tab}
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
            ))}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              href="#"
              icon={HiUser}
              label={
                (currentUser.user?.isAdmin ||
                  currentUser.isAdmin ||
                  currentUser.rest?.isAdmin) === true
                  ? "Admin"
                  : "User"
              }
              labelColor="dark"
              as="div"
              active={tab === "profile"}
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.user?.isAdmin ||
            currentUser.isAdmin ||
            (currentUser.rest?.isAdmin === true && (
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item
                  href="#"
                  icon={HiDocumentText}
                  active={tab === "posts"}
                >
                  Posts Manager
                </Sidebar.Item>
              </Link>
            ))}

          {currentUser.user?.isAdmin ||
            currentUser.isAdmin ||
            (currentUser.rest?.isAdmin === true && (
              <Link to="/dashboard?tab=users-manager">
                <Sidebar.Item
                  href="#"
                  icon={HiUserGroup}
                  active={tab === "users-manager"}
                >
                  Users Manager
                </Sidebar.Item>
              </Link>
            ))}

          {currentUser?.rest.isAdmin === true && (
            <Link to="/dashboard?tab=comments-manager">
              <Sidebar.Item
                href="#"
                icon={FaCommentAlt}
                active={tab === "comments-manager"}
              >
                Comments Manager
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item
            href="#"
            icon={HiArrowSmRight}
            active={tab === "sign-out"}
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
