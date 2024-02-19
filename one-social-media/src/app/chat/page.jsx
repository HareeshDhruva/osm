"use client";
import React, { useState, useEffect, useRef } from "react";
const socket = io.connect(process.env.NEXT_PUBLIC_BACKEND);
import { IoArrowBackCircle } from "react-icons/io5";
import SendIcon from "@mui/icons-material/Send";
import { io } from "socket.io-client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { adminData, getMessage } from "../utils/api";
import { MdChat } from "react-icons/md";
import Register from "@/app/components/login/Main";
import Link from "next/link";

const page = () => {
  const [currentMessage, setCurrentMessage] = useState();
  const [message, setMessage] = useState([]);
  const [connector, setConnector] = useState();
  const bottomRef = useRef(null);

  const { data: Admin } = useQuery({ queryKey: ["Admin"], queryFn: adminData });
  const friends = Admin?.friends;

  const connectorData = Admin?._id;
  socket.emit("join_room", connectorData);
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        sender_name: Admin?.firstname + " " + Admin?.lastname,
        profile: Admin?.profileUrl.url || "default_profile.jpeg",
        sender: Admin?._id,
        receiver: connector?._id,
        room: connectorData,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes() +
          ":" +
          new Date(Date.now()).getSeconds(),
      };
      await socket.emit("send_message", messageData);
      setMessage((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const messagecall = (e) => {
    e.preventDefault();
    setCurrentMessage(e.target.value);
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessage((prevMessages) => [...prevMessages, data]);
    };
    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [message]);

  const messages = useMutation({
    mutationFn: (data) => getMessage(data),
    onSuccess: (data) => {
      setMessage(data);
    },
  });

  const setUser = (user) => {
    if (user !== connector) {
      setConnector(user);
      const data = { sender: Admin?._id, receiver: user?._id };
      messages.mutate(data);
    }
  };

  return (
    <>
      {Admin != null ? (
        <div className="grid grid-cols-4 overflow-hidden">
          <div className="h-[100dvh] col-span-1 bg-red-500">
            <div className="m-2 flex flex-col gap-5">
              <div>
                <p className="text-[#fff] md:p-2 text-[1rem] max-md:text-[0.5rem] text-center font-bold m-1 uppercase">
                  connection
                </p>
                <div className="h-[92dvh] overflow-y-scroll m-2 text-[0.7rem] containe">
                  <div className="p-1 text-center font-bold">
                    <div>
                      {friends &&
                        friends.map((friend) => (
                          <>
                            <div className="flex gap-2 text-center m-1 text-black bg-white items-center p-1 rounded-3xl justify-between max-md:hidden">
                              <div className="flex md:gap-5 items-center w-full">
                                {friend.profileUrl ? (
                                  <img
                                    className="ring-1 ring-gray-500 rounded-full w-10"
                                    src={friend.profileUrl.url}
                                  />
                                ) : (
                                  <img
                                    className="ring-1 ring-gray-500 rounded-full w-10"
                                    src="default_profile.jpeg"
                                  />
                                )}

                                <p>
                                  {friend.firstname}{" "}
                                  <span>{friend.lastname}</span>
                                </p>
                              </div>
                              <div className="text-[1.5rem] max-lg:text-[0.8rem] mx-2">
                                <MdChat onClick={() => setUser(friend)} />
                              </div>
                            </div>
                            <div
                              className="flex md:gap-5 items-center justify-center w-full md:hidden my-2"
                              onClick={() => setUser(friend)}
                            >
                              {friend.profileUrl ? (
                                <img
                                  className="ring-1 ring-gray-500 rounded-full w-10"
                                  src={friend.profileUrl.url}
                                />
                              ) : (
                                <img
                                  className="ring-1 ring-gray-500 rounded-full w-10"
                                  src="default_profile.jpeg"
                                />
                              )}
                            </div>
                          </>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <div className="m-auto w-full max-md:text-[0.5rem]">
              <div className="flex justify-between min-h-[8dvh] mx-4">
                <div className="flex md:gap-5 items-center w-full text-[#fff]">
                  {connector && (
                    <div className="flex gap-4 justify-center items-center">
                      <img
                        className="ring-1 ring-gray-500 rounded-full w-10 max-md:w-5"
                        src={connector.profileUrl.url}
                      />
                      <p>
                        {connector.firstname} <span>{connector.lastname}</span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center gap-4 mx-4">
                  <Link href="/home">
                    <IoArrowBackCircle className="text-[#fff] text-[2rem] max-md:text-[1.5rem]" />
                  </Link>
                </div>
              </div>
            </div>
            <div
              mode="bottem"
              className="col-span-3 bg-black overflow-y-scroll h-[85dvh] overflow-x-hidden max-sm:text-[0.5rem]"
            >
              {message.map((item) => (
                <div>
                  {item.sender_name !==
                  Admin?.firstname + " " + Admin?.lastname ? (
                    <>
                      <div className="flex justify-start mx-4">
                        <div className="p-2 m-2 rounded-r-xl rounded-t-xl max-w-[50%] text-[#fff] bg-[orange]">
                          <p className="whitespace-normal break-words text-balance mx-2 font-bold">
                            {item.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-start text-xs text-[#fff] gap-4 mx-4">
                        <img
                          src={item?.profile}
                          className="w-5 rounded-full"
                          alt="photo"
                        />
                        <p className="text-[0.5rem]">{item.sender_name}</p>
                        <p className="text-[0.5rem]">{item.time}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-end mx-4">
                        <div className="p-2 m-2 max-w-[50%] rounded-l-xl rounded-t-xl text-[#fff] bg-green-500">
                          <p className="whitespace-normal break-words text-balance mx-2 font-bold">
                            {item.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end text-[#fff] text-xs gap-4 mx-4">
                        <p className="text-[0.5rem]">{item.time}</p>
                        <p className="text-[0.5rem]">{item.sender_name}</p>
                        <img
                          src={item?.profile}
                          className="w-5 rounded-full"
                          alt="photo"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
              <div className="fixed bottom-0 w-[70%] p-2">
                <div className="flex items-center md:mx-6">
                  <div className="flex gap-5 w-full justify-between items-center">
                    {connector && (
                      <>
                        <input
                          type="text"
                          value={currentMessage}
                          name="currentMessage"
                          id=""
                          onChange={messagecall}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") sendMessage();
                          }}
                          className="w-full h-10 max-md:h-8 rounded-3xl px-4 focus:outline-none text-[#000]"
                        />
                        <div>
                          <SendIcon
                            onClick={sendMessage}
                            className="h-5 cursor-pointer max-md:h-3 text-[#fff]"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div ref={bottomRef}></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen flex justify-center items-center">
          <Register />
        </div>
      )}
    </>
  );
};
export default page;
