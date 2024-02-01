import React, { useState, useContext } from "react";
import { MdOutlineEdit } from "react-icons/md";
import ProfilePhotoUpdate from "./ProfilePhotoUpdate";
import { UserContest } from "@/app/Context/UserContest";
import { adminData } from "@/app/utils/api";
import { useQuery } from "@tanstack/react-query";
import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const ProfileCard = () => {
  const [mode, setMode] = useState("");
  const context = useContext(UserContest);

  const [profile, profileChange] = useState(false);

  const changeProfile = (e) => {
    e.preventDefault();
    context.photoUpateType = "PROFILE UPDATE";
    setMode("PROFILE UPDATE");
    profileChange(true);
  };

  const {
    data: Admin,
    isLoading: loading,
    isSuccess: success,
  } = useQuery({ queryKey: ["Admin"], queryFn: adminData });
  return (
    <>
      <div className="rounded-3xl my-2 ring-1 ring-gray-500">
        <p className="text-[#fff] p-1 rounded-lg text-center font-bold m-1 uppercase">
          Admin
        </p>
        <div className="mx-2 rounded-lg p-1 text-[0.7rem] min-w-[12rem] ">
          <div className="flex items-center flex-col" onClick={changeProfile}>
            {Admin && Admin?.profileUrl !== null ? (
              <Tooltip
                title="PROFILE"
                TransitionComponent={Fade}
                followCursor
                arrow
              >
                <img
                  className="block mx-auto ring-4 rounded-[50%] h-[8rem] ring-gray-500 my-4"
                  src={Admin.profileUrl.url}
                  alt=""
                />
              </Tooltip>
            ) : (
              <img
                className="block mx-auto ring-4 rounded-[50%] h-[8rem] ring-gray-500 my-4"
                src="default_profile.jpeg"
                alt=""
              />
            )}
            <Tooltip title="PROFILE UPDATE" TransitionComponent={Fade} arrow>
              <MdOutlineEdit className="text-white text-[1.5rem]  max-md:text-[0.9rem]" />
            </Tooltip>
            <div className="block">
              {Admin ? (
                <p className="h-10 p-2 my-1 rounded-lg text-center font-bold text-[0.9rem] max-md:mx-0 text-[#fff] ">
                  @ {Admin?.firstname + "_" + Admin?.lastname}
                </p>
              ) : (
                <p className="h-10 p-2 my-1 rounded-lg text-center font-bold text-[0.9rem] max-md:mx-0 text-[#fff]">
                  @ usernamae
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-between m-2 flex-col gap-4">
            {Admin && Admin.location !== null ? (
              <div className="p-2 bg-white rounded-3xl hover:ring-2 ring-black">
                <p className="text-center font-bold">{Admin.location}</p>
              </div>
            ) : (
              <div className="p-2 bg-white rounded-3xl hover:ring-2 ring-black">
                <p className="text-center font-bold">Location</p>
              </div>
            )}
            {Admin && Admin.profession !== null ? (
              <div className="p-2 bg-white rounded-3xl hover:ring-2 ring-black">
                <p className="text-center font-bold">{Admin.profession}</p>
              </div>
            ) : (
              <div className="p-2 bg-white rounded-3xl hover:ring-2 ring-black">
                <p className="text-center font-bold">Profession</p>
              </div>
            )}
          </div>
          <ProfilePhotoUpdate
            open={profile}
            setOpen={profileChange}
            mode={mode}
          />
        </div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          onClick={success}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </>
  );
};

export default ProfileCard;
