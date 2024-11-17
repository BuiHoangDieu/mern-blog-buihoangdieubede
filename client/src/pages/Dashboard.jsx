import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import { useSelector } from "react-redux";
import DashComment from "../components/DashComment";
import DashboardComponent from "../components/DashboardComponent";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const theme = useSelector((state) => state.theme.theme);
  // console.log(theme);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");
    // console.log(tabFormUrl);
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
  }, [location.search]);

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row ${
        theme === "dark" ? "bg-[rgba(16,23,42,1)] text-gray-100" : "bg-white"
      }`}
    >
      <div className="">
        <DashSidebar />
      </div>
      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <DashPosts />}
      {tab === "users-manager" && <DashUsers />}
      {tab === "comments-manager" && <DashComment />}
      {tab === "dashboard-manager" && <DashboardComponent />}
    </div>
  );
};

export default Dashboard;
