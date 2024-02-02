import React from "react";
import { Avatar } from "@mui/material";

const AvatarBlock = ({ url, data }) => {
  return (
    <>
      <div className="flex gap-3 items-center justify-between rounded-3xl">
        <div className="flex items-center ring-1 ring-gray-500 rounded-3xl">
          <Avatar sizes="small" className="ring-1 ring-gray-500" src={url} />
          <p className="text-[#fff] mx-2 my-2 font-bold max-md:text-[0.7rem] ">
            {data}
          </p>
        </div>
        <div className="flex gap-3"></div>
      </div>
    </>
  );
};

export default AvatarBlock;
