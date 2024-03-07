"use client";
import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { MdAccountCircle } from "react-icons/md";
import { adminData, deletePost, getUser, getUserPost } from "@/app/utils/api";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import Link from "next/link";
import { FaUserEdit } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProfileUpdate from "./homecomponents/Profile/profileUpdate";
import ProfileCard from "./homecomponents/Profile/ProfileCard";
import FriendRequest from "./homecomponents/FriendRequest";
import Suggestion from "./homecomponents/Suggestion";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  DialogContent,
  Dialog,
  Drawer,
  AppBar,
  Toolbar,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";

const NavBar = () => {
  const [userid, setUserId] = useState("");
  const [userWindow, setUserWindow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [mini, setMini] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const onLogout = async () => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    if (res.status === 200) {
      localStorage.clear();
      window.location.replace("/");
    }
  };

  //user
  const { data: Admin } = useQuery({ queryKey: ["Admin"], queryFn: adminData });
  const queryClient = useQueryClient();

  const userWindowHandle = (id) => {
    setUserId(id);
    setUserWindow(true);
    mutate();
    usePost.mutate();
  };

  const handleClose = () => {
    setUserWindow(false);
    setMini(false);
  };
  const handleOpen = () => {
    setEdit(true);
  };

  const { mutate, data: UserData } = useMutation({
    mutationFn: () => getUser(userid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  let timestampStr = UserData?.DOB;
  let birthday;
  if (timestampStr) {
    let timestamp = new Date(timestampStr);
    birthday = timestamp.toISOString().split("T")[0];
  } else {
    birthday = null;
  }

  // mini
  const handleChangeMini = () => {
    setMini(true);
  };

  //delete

  const usePost = useMutation({
    mutationFn: () => getUserPost(userid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPost"] });
    },
  });

  const deletepost = useMutation({
    mutationFn: (userid) => deletePost(userid),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      setUserWindow(false);
      if(message === "Delete SuccessFully"){
        enqueueSnackbar(message,{
          autoHideDuration: 2000,
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          preventDuplicate: false,
        });
      }
      else{
        enqueueSnackbar(message, {
          autoHideDuration: 2000,
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          preventDuplicate: false,
        });
      }
    }
  });

  const deletePostId = (id) => {
    deletepost.mutate(id);
  };

  return (
    <nav className="w-full bg-black fixed z-10">
      <div className="flex h-20 justify-between md:gap-5 items-center md:mx-4">
        <div className="mx-5 max-md:mx-1">
          <Link href="/home">
            <img src="osm-white.png" className="max-md:w-12 w-20" />
          </Link>
        </div>
        <div className="flex items-center max-md:text-[0.7rem] text-[0.9rem]">
          <button
            type="submit"
            className="py-2 px-2 rounded-3xl text-white font-bold "
            onClick={(e) => userWindowHandle(Admin?._id)}
          >
            <div className="flex items-center justify-center gap-1 uppercase">
              <MdAccountCircle />
              Profile
            </div>
          </button>

          <button
            type="submit"
            className="py-2 px-4 max-md:px-1 rounded-3xl text-white font-bold uppercase"
            onClick={handleOpen}
          >
            <div className="flex justify-center items-center gap-1">
              <FaUserEdit color="#fff" />
              Edit
            </div>
          </button>

          <div className="flex gap-5 max-md:hidden">
            <div className="ring-2 ring-gray-500 rounded-[50%]">
              <Tooltip
                title="PROFILE"
                TransitionComponent={Fade}
                onClick={(e) => userWindowHandle(Admin?._id)}
                arrow
              >
                <Avatar src={Admin?.profileUrl?.url} />
              </Tooltip>
            </div>
            <button
              type="submit"
              className="py-2 px-4 rounded-3xl bg-white uppercase font-bold"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
          <div className="md:hidden text-[1.5rem] text-[#fff] p-4">
            <FiMenu onClick={handleChangeMini} />
          </div>
        </div>
      </div>
      {/* start */}
      <Dialog open={userWindow} onClose={handleClose} fullScreen>
        <DialogContent sx={{ bgcolor: "black" }}>
          <div>
            <AppBar sx={{ position: "relative", bgcolor: "#000" }}>
              <Toolbar>
                <div className="flex justify-between w-full">
                  <p className="text-[#fff] p-1 rounded-lg text-center font-bold m-1 uppercase">
                    user Data
                  </p>
                  <IconButton edge="end" color="inherit" onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </div>
              </Toolbar>
            </AppBar>
            {UserData && (
              <>
                <div className="rounded-lg">
                  <div className="text-[0.7rem] min-w-[12rem] bg-black">
                    <div className="flex items-center flex-col">
                      {UserData.profileUrl ? (
                        <img
                          className="block mx-auto ring-4 rounded-[50%] h-[8rem] ring-gray-500 my-4"
                          src={UserData.profileUrl.url}
                          alt=""
                        />
                      ) : (
                        <img
                          className="block mx-auto ring-4 rounded-[50%] h-[8rem] ring-gray-500 my-4"
                          src="default_profile.jpeg"
                          alt=""
                        />
                      )}
                      <div className="block">
                        <p className="h-10 p-2 my-1 rounded-lg text-center font-bold text-[0.9rem] max-md:mx-0 text-[#fff] ">
                          @ {UserData?.firstname + "_" + UserData?.lastname}
                        </p>
                      </div>
                    </div>
                    <div className="p-2 font-bold text-[0.9rem] text-center max-md:text-[0.5rem]">
                      <p className="lowercase m-auto text-[#fff]">
                        {UserData.email}
                      </p>
                    </div>
                    <hr className="w-[90%] m-auto" />
                    <div className="flex justify-center flex-col">
                      <div className="text-center uppercase rounded-lg gap-2 text-[#fff] ">
                        <div className="grid grid-cols-2 p-2 font-bold my-5 text-[0.9rem] max-md:text-[0.5rem]">
                          <p>location</p>
                          <p>{UserData.location}</p>
                        </div>
                        <hr className="w-[80%] m-auto" />
                        <div className="grid grid-cols-2 p-2 font-bold my-5 text-[0.9rem] max-md:text-[0.5rem]">
                          <p>profession</p>
                          <p>{UserData.profession}</p>
                        </div>
                        <hr className="w-[70%] m-auto" />
                        <div className="grid grid-cols-2 p-2 font-bold my-5 text-[0.9rem] max-md:text-[0.5rem]">
                          <p> date of birth</p>
                          <p>{birthday}</p>
                        </div>
                        <hr className="w-[80%] m-auto" />
                        <div className="grid grid-cols-2 p-2 font-bold my-5 text-[0.9rem] max-md:text-[0.5rem]">
                          <p>gender</p>
                          <p>{UserData.gender}</p>
                        </div>
                        <hr className="w-[90%] m-auto mb-4" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 max-md:grid-cols-1 gap-2">
                      <div className="ring-1 ring-gray-500 m-2">
                        <p className="bg-black ring-1 ring-gray-500 text-[#fff] p-4  text-center font-bold m-1 uppercase">
                          posts
                        </p>
                        <div className="grid md:grid-cols-3 max-md:grid-cols-2 bg-black gap-1 m-1">
                          {usePost.data &&
                            usePost.data.map((post) => (
                              <div className="p-4 w-full flex flex-col justify-between items-center ring-1 ring-gray-500">
                                <img
                                  src={post.image.url}
                                  alt=""
                                  className="w-[200px] hover:blur-sm"
                                />
                                <div className="flex items-center w-[80%] justify-between mt-2">
                                  <DeleteIcon
                                    className="text-[#fff] text-[1rem]"
                                    onClick={() =>
                                      deletePostId(
                                        post._id,
                                        post.image.public_id
                                      )
                                    }
                                  />
                                  <div className="flex items-center gap-1">
                                    <FavoriteIcon className="text-[#fff] text-[1rem]" />
                                    <p className="text-[#fff]">
                                      {post.likes.length}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="ring-1 ring-gray-500 m-2">
                        <p className="bg-black text-[#fff] ring-1 ring-gray-500 p-4  text-center font-bold m-1 uppercase">
                          friends
                        </p>
                        <div className="grid md:grid-cols-3 max-md:grid-cols-2 bg-black gap-1 m-1">
                          {UserData.friends &&
                            UserData.friends.map((friend) => (
                              <div
                                className="p-4 w-full flex flex-col justify-between items-center ring-1 ring-gray-500"
                                onClick={(e) => userWindowHandle(friend._id)}
                              >
                                {friend.profileUrl ? (
                                  <img
                                    src={friend.profileUrl.url}
                                    alt=""
                                    className=" w-[200px] hover:blur-sm"
                                  />
                                ) : (
                                  <img
                                    src="default_profile.jpeg"
                                    width={40}
                                    alt=""
                                    className="w-[200px] hover:blur-sm rounded-full"
                                  />
                                )}
                                <p className="text-center text-[#fff] font-bold max-md:text-[0.5rem] mt-2">
                                  {"@ " +
                                    friend.firstname +
                                    "_" +
                                    friend.lastname}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {/* end */}
      <Dialog open={edit} onClose={handleClose} fullScreen>
        <ProfileUpdate setEdit={setEdit} />
      </Dialog>
      <Drawer open={mini} onClose={handleClose} anchor="right">
        <div className="bg-black px-10 py-2 flex flex-col gap-2">
          <div onClick={handleClose} typeof="button">
            <div className="w-full h-10 ring-gray-500 rounded-3xl justify-center flex items-center ring-1">
              <p className="m-1 uppercase font-bold cursor-pointer text-[#fff]">
                close
              </p>
            </div>
          </div>
          <ProfileCard />
          <FriendRequest />
          <Suggestion />
          <div onClick={onLogout} typeof="button">
            <div className="ring-1 w-full h-10 ring-gray-500 rounded-3xl justify-center flex items-center">
              <p className="m-1 uppercase font-bold cursor-pointer text-[#fff]">
                logout
              </p>
            </div>
          </div>
        </div>
      </Drawer>
    </nav>
  );
};

export default NavBar;
