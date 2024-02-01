"use client";
import React, { useState } from "react";
import { adminData, updateUser } from "@/app/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { AppBar, Toolbar } from "@mui/material";

const ProfileUpdate = ({ setEdit }) => {
  const { data: Admin } = useQuery({ queryKey: ["Admin"], queryFn: adminData });

  const pageData = {
    firstname: "",
    lastname: "",
    DOB: "",
    gender: "",
    profession: "",
    location: "",
  };

  const [pagedata, setpage] = useState(pageData);
  const queryClient = useQueryClient();

  const onValue = (e) => {
    e.preventDefault();
    setpage({ ...pagedata, [e.target.name]: e.target.value });
  };

  const { mutate } = useMutation({
    mutationFn: (pagedata) => updateUser(pagedata),
    onSuccess: () => {
      setEdit(false);
      queryClient.invalidateQueries(["Admin"]);
    },
  });

  const onpage = (e) => {
    mutate(pagedata);
  };

  return (
    <div className="flex justify-center flex-col items-center h-[100dvh] bg-black">
      <AppBar sx={{ position: "absolute", bgcolor: "#000" }}>
        <Toolbar>
          <div className="flex justify-between w-full">
            <p className="text-[#fff] p-1 rounded-lg text-center font-bold m-1 uppercase">
              Admin Data
            </p>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setEdit(false)}
            >
              <CloseIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {Admin && (
        <div className="p-4 rounded-3xl bg-blacg shape  bg-black ring-1 ring-gray-500">
          <p className="text-center uppercase font-bold text-[#fff]">Update</p>
          <div className="flex flex-col gap-5 my-4">
            <input
              type="text"
              id=""
              name="firstname"
              placeholder="firstname"
              className="p-2 rounded-3xl focus:outline-none ring-1 ring-black text-center"
              onChange={(e) => onValue(e)}
            />
            <input
              type="text"
              id=""
              name="lastname"
              placeholder="lastname"
              className="p-2 rounded-3xl focus:outline-none ring-1 ring-black text-center"
              onChange={(e) => onValue(e)}
            />
            <input
              type="text"
              id=""
              name="profession"
              placeholder="profession"
              className="p-2 rounded-3xl focus:outline-none ring-1 ring-black text-center "
              onChange={(e) => onValue(e)}
            />
            <input
              type="text"
              id=""
              name="location"
              placeholder="location"
              className="p-2 rounded-3xl focus:outline-none ring-1 ring-black text-center"
              onChange={(e) => onValue(e)}
            />
          </div>

          <div className="flex gap-5 my-5 justify-center items-center">
            <p className="text-[#fff] font-semibold">Date of birth ?</p>
            <input
              type="date"
              id=""
              name="DOB"
              placeholder="date of birth"
              className="p-2 rounded-3xl text-[gray] focus:outline-none text-center "
              onChange={(e) => onValue(e)}
            />
          </div>

          <div className="flex justify-between my-4">
            <p className="font-semibold text-[#fff]">Gender ?</p>
            <select
              name="gender"
              id=""
              onChange={(e) => onValue(e)}
              className="p-2 rounded-3xl focus:outline-none text-center text-[gray]"
            >
              <option placeholder="male">male</option>
              <option placeholder="female">female</option>
              <option placeholder="other">other</option>
            </select>
          </div>
          <div className="flex justify-center gap-2">
            <div
              className="bg-white hover:bg-black hover:ring-gray-500 ring-1  text-[#000] hover:text-[#fff] text-center px-2 py-2 rounded-3xl font-bold w-1/2 uppercase"
              onClick={() => {
                setEdit(false);
              }}
            >
              cancle
            </div>

            <button
              type="submit"
              className="bg-white hover:bg-black hover:ring-gray-500 ring-1  text-[#000] hover:text-[#fff] px-2 py-2 rounded-3xl font-bold w-1/2 uppercase"
              onClick={(e) => onpage(e)}
            >
              update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileUpdate;
