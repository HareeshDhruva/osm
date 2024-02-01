"use client";
import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa6";
import {
  deletePost,
  getUser,
  getUserPost,
  sendFriendRequestMod,
  suggestionMode,
} from "@/app/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Dialog, DialogContent, AppBar, Toolbar } from "@mui/material";
import { useSnackbar } from "notistack";

const Suggestion = () => {
  const queryClient = useQueryClient();
  const { data: SuggestionData } = useQuery({
    queryKey: ["suggestion"],
    queryFn: suggestionMode,
  });

  const { enqueueSnackbar } = useSnackbar();

  const RequestMutation = useMutation({
    mutationFn: (newData) => sendFriendRequestMod(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestion"] });
    },
  });

  const sendRequest = (id) => {
    const newData = { requestId: id };
    RequestMutation.mutate(newData);
    console.log(RequestMutation.data);
    const newMessage = RequestMutation.data;
    if (newMessage === undefined) {
      enqueueSnackbar("Send Request Success", {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } else {
      enqueueSnackbar(newMessage, {
        autoHideDuration: 3000,
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        preventDuplicate: false,
      });
    }
  };

  //user

  const [userid, setUserId] = useState("");
  const [userWindow, setUserWindow] = useState(false);

  const userWindowHandle = (id) => {
    setUserId(id);
    setUserWindow(true);
    mutate();
    usePost.mutate();
  };

  const handleClose = () => {
    setUserWindow(false);
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

  //get user
  const usePost = useMutation({
    mutationFn: () => getUserPost(userid),
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
    <div className="ring-1 ring-gray-500 rounded-3xl h-[50%]">
      <p className="text-[#fff] p-1 rounded-lg text-center font-bold m-1 uppercase">
        Suggestion
      </p>
      <div className="h-[17rem] rounded-3xl overflow-y-scroll m-2 text-[0.7rem]">
        <div className="p-1 rounded-lg text-center font-bold max-h-min ">
          <div>
            {SuggestionData?.map((friend) => (
              <div className="flex gap-2 text-center m-1 text-white hover:text-black items-center p-1 rounded-3xl hover:bg-white justify-between">
                <div
                  className="flex gap-2 items-center w-full"
                  onClick={(e) => userWindowHandle(friend._id)}
                >
                  {friend.profileUrl ? (
                    <img
                      className="ring-1 ring-gray-500 rounded-full"
                      width={40}
                      src={friend.profileUrl.url}
                    />
                  ) : (
                    <img
                      className="ring-1 ring-gray-500 rounded-full"
                      width={40}
                      src="default_profile.jpeg"
                    />
                  )}
                  <p>
                    {friend.firstname}{" "}
                    <span className="md:invisible lg:visible">
                      {friend.lastname}
                    </span>
                  </p>
                </div>

                <div className="text-[1.5rem] max-lg:text-[0.8rem] mx-2">
                  <FaUserPlus onClick={(e) => sendRequest(friend._id)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={userWindow} onClose={handleClose} fullScreen color="black">
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
                                {friend.profileUrl? (
                                  <img
                                    src={friend.profileUrl.url}
                                    alt=""
                                    className=" w-[200px] hover:blur-sm"
                                  />
                                ) : (
                                  <img
                                    src="default_profile.jpeg "
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
    </div>
  );
};

export default Suggestion;
