import React from "react";

export const ReplyAvatarBlock = ({ url, data }) => {
  return (
    <>
      <div className="flex gap-3 items-center justify-between rounded-3xl">
        <div className="flex items-center rounded-3xl">
          <img src={url} alt="" className="w-5 rounded-full" />
          <p className="text-[#fff] mx-2 max-md:mx-4 my-2 font-bold max-md:text-[0.7rem] ">
            {data}
          </p>
        </div>
        <div className="flex gap-3"></div>
      </div>
    </>
  );
};
