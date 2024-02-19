"use client";
import "./page.css";
import ProfileCard from "../components/homecomponents/Profile/ProfileCard";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Post from "../components/Post/Post";
import FriendRequest from "../components/homecomponents/FriendRequest";
import Suggestion from "../components/homecomponents/Suggestion";
import Friends from "../components/homecomponents/Friends";
import { useQuery } from "@tanstack/react-query";
import { adminData } from "../utils/api";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Message from "../components/homecomponents/message";

const Home = () => {
  const {
    data: Admin,
    isLoading: loading,
    isSuccess: success,
  } = useQuery({ queryKey: ["Admin"], queryFn: adminData });
  return (
    <div className="bg-black">
      {Admin && (
        <>
          <NavBar />
          <div className="h-20"></div>
          <div className="flex justify-between overflow-hidden">
            <div className="w-[25%] rounded-lg m-2 flex flex-col gap-5 max-md:w-[50%] max-sm:hidden">
              <ProfileCard />
              <Friends />
            </div>
            <div className="md:w-[40%] flex justify-center">
              <Post />
            </div>
            <div className="w-[25%] h-full m-2 rounded-lg flex flex-col gap-5 max-md:hidden">
              <FriendRequest />
              <Suggestion />
            </div>
          </div>
          <Footer/>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
            onClick={success}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      )}
    </div>
  );
};

export default Home;
