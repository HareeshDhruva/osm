import React, { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import "../../globals.css";
import LikeDislike from "./Like";
import {
  deletePost,
  getAllPost,
  getUser,
  getUserPost,
  sendFriendRequestMod,
} from "@/app/utils/api";
import Comment from "./comment/Comment";
import MakePost from "./MakePost";
import PostInput from "./PostInput";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaUserPlus } from "react-icons/fa6";
import { MdOutlinePostAdd } from "react-icons/md";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Dialog, DialogContent, AppBar, Toolbar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const URL = process.env.NEXT_PUBLIC_BACKEND;

const Post = () => {
  const [open, setOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [id, setid] = useState("");
  const [mode, setMode] = useState("");
  const [userid, setUserId] = useState("");
  const [userWindow, setUserWindow] = useState(false);
  const [showComponent, setShowComponent] = useState("");
  const [friendRequestId, setFriendRequestId] = useState();
  const newData = { requestId: friendRequestId };

  const userWindowHandle = (id) => {
    setUserId(id);
    setUserWindow(true);
    mutate();
  };

  const handleClose = () => {
    setOpen(false);
    setUserWindow(false);
  };
  const handleOpen = (id) => {
    setid(id);
    setOpen(true);
    usePost.mutate(id);
  };

  const handlepostOpen = () => {
    setMode("MAKE POST");
    setPostOpen(true);
  };

  const handlepostClose = () => {
    setPostOpen(false);
  };

  const {
    data: Post,
    isLoading: loading,
    isSuccess: success,
  } = useQuery({ queryKey: ["post"], queryFn: getAllPost });

  const queryClient = useQueryClient();

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

  const searchUserResult = useMutation({
    mutationKey: ["searchUserResult"],
    mutationFn: async (searchData) => {
      const response = await axios.post(`${URL}/searchUser`, {
        search: searchData,
      });
      return response.data.data;
    },
  });

  const handleSearch = (e) => {
    setShowComponent(e.target.value);
    searchUserResult.mutate(e.target.value);
  };

  //send request
  const mutation = useMutation({
    mutationFn: () => sendFriendRequestMod(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestion"] });
    },
  });

  const sendRequest = (id) => {
    setFriendRequestId(id);
    mutation.mutate();
  };

  const usePost = useMutation({
    mutationFn: (newid) => getUserPost(newid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPost"] });
    },
  });

  const deletepost = useMutation({
    mutationFn: (userid) => deletePost(userid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      setUserWindow(false);
    },
  });

  const deletePostId = (id) => {
    deletepost.mutate(id);
  };

  return (
    <div>
      <div className="overflow-hidden flex justify-center flex-col items-center">
        <div className="flex justify-center items-center w-full">
          {!loading && (
            <div className="w-[100%] mx-2">
              <div className="flex justify-between container">
                <input
                  type="text"
                  className="rounded-3xl bg-black text-white w-[90%] h-10 max-md:h-8 focus:outline-none focus:border-gray-800 my-4 px-5 ring-1 ring-gray-500"
                  placeholder="search user"
                  name=""
                  id=""
                  onChange={handleSearch}
                />
                <div className="h-10 m-4 text-[1.5rem] text-[#fff]">
                  <div className="flex flex-col justify-center gap-2">
                    <MdOutlinePostAdd onClick={handlepostOpen} />
                    <MakePost
                      open={postOpen}
                      setPostOpen={handlepostClose}
                      mode={mode}
                    />
                    <p className="text-[0.7rem] uppercase text-center">post</p>
                  </div>
                </div>
              </div>
              {showComponent && (
                <div className="z-aut absolute bg-white md:min-w-[35%] max-md:w-[90%] max-sm:max-w-[80%] max-md:max-w-[50%] rounded-3xl max-lg:w-[35%]">
                  {searchUserResult.data && (
                    <ul className="rounded-lg w-full">
                      {searchUserResult.data
                        .filter((user) => user.firstname.toLowerCase())
                        .map((user) => (
                          <li className="flex justify-between m-2 items-center ring-1 ring-gray-400 rounded-full">
                            <div
                              className="flex gap-5 justify-start items-center rounded-l-3xl w-[80%]"
                              onClick={(e) => userWindowHandle(user._id)}
                            >
                              {user.profileUrl ? (
                                <img
                                  className="ring-1 ring-gray-500 rounded-full w-10 max-md:w-8"
                                  src={user.profileUrl.url}
                                />
                              ) : (
                                <img
                                  className="ring-1 ring-gray-500 rounded-full w-10 max-md:w-8"
                                  src="default_profile.jpeg"
                                />
                              )}
                              <p className="text-[#000]">
                                {user.firstname + " " + user.lastname}
                              </p>
                            </div>

                            <div className="text-[1.5rem] max-lg:text-[1rem] p-2 rounded-r-3xl w-[10%] flex items-center justify-center text-[#fff]">
                              <FaUserPlus
                                onClick={(e) => sendRequest(user._id)}
                              />
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        <div className=" h-[80dvh] overflow-y-scroll text-white">
          <div className="max-w-[600px] overflow-hidden">
            {Post?.map((users) => (
              <div className="flex flex-col gap-5 text-center my-2">
                <div
                  className="flex items-center gap-5 flex-start justify-between w-[90%] m-auto"
                  onClick={(e) => userWindowHandle(users?.userId?._id)}
                >
                  <div className="flex gap-5 items-center">
                    {users?.userId?.profileUrl ? (
                      <img
                        className="ring-1 ring-gray-500 rounded-full w-6"
                        src={users?.userId?.profileUrl?.url}
                      />
                    ) : (
                      <img
                        className="ring-1 ring-gray-500 rounded-full w-6"
                        src="default_profile.jpeg"
                      />
                    )}
                    <p>
                      {users.userId.firstname + " " + users.userId.lastname}
                    </p>
                  </div>
                  <div className="mr-4">
                    <AiOutlineMenu />
                  </div>
                </div>
                <div>
                  {users.image && (
                    <div className="flex justify-center">
                      <img
                        onClick={(e) => {
                          if (users.comments.length !== 0) {
                            handleOpen(users._id);
                          }
                        }}
                        className="flex justify-center items-center"
                        src={users.image.url}
                        alt="profile"
                      />
                    </div>
                  )}
                  <div className="p-2 flex gap-5 ">
                    <LikeDislike like={users.likes} id={users._id} />
                  </div>
                  <div className="flex items-start flex-col gap-2 mx-6">
                    <p>
                      <span className="font-bold">
                        {"@ " +
                          users.userId.firstname +
                          "_" +
                          users.userId.lastname}
                      </span>
                      <span className="font-[100] ml-1">
                        {" " + users.description}
                      </span>
                    </p>
                    {users.comments.length !== 0 && (
                      <p
                        className="cursor-pointer font-[100]"
                        onClick={(e) => handleOpen(users._id)}
                      >
                        View all {users.comments.length} comments .....{" "}
                      </p>
                    )}
                    <Comment open={open} setOpen={handleClose} id={id} />
                  </div>
                  <PostInput uid={users._id} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Dialog open={userWindow} onClose={handleClose} fullScreen>
          <DialogContent sx={{ bgcolor: "black" }}>
            <div>
              <AppBar sx={{ position: "relative", bgcolor: "#000" }}>
                <Toolbar>
                  <div className="flex justify-between w-full">
                    <p className="text-[#fff] p-1 rounded-lg text-center font-bold m-1 uppercase">
                      User data
                    </p>
                    <IconButton
                      edge="end"
                      color="inherit"
                      onClick={handleClose}
                    >
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
                            className="block mx-auto ring-4 h-[8rem] ring-gray-500 my-4 rounded-full"
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
                                      onClick={() => deletePostId(post._id)}
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

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          onClick={success}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </div>
  );
};

export default Post;
