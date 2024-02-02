import React, { useContext } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import { UserContest } from "../Context/UserContest";
import { useQueryClient } from "@tanstack/react-query";
const token =
  typeof window !== "undefined" ? localStorage.getItem("user") : null;

const URL = process.env.NEXT_PUBLIC_BACKEND;

const UploadComponent = ({ name, description }) => {
  const context = useContext(UserContest);
  const queryClient = useQueryClient();
  const image = context.photo;

  const handleUpload = async () => {
    try {
      if (name !== "MAKE POST") {
        const response = await axios.post(`${URL}/updateProfilePhoto`, {
          method: "POST",
          data: image,
          headers: {
            "Content-Type": "application/json",
            authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (response.status === 200) {
          queryClient.invalidateQueries({ queryKey: ["Admin"] });
        } else {
          console.log("error");
        }
      } else {
        const data = { description, image };
        const response = await axios.post(`${URL}/create-post`, {
          method: "POST",
          data: data,
          headers: {
            "Content-Type": "application/json",
            authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (response.status === 200) {
          queryClient.invalidateQueries({ queryKey: ["post"] });
        } else {
          console.log("fail");
        }
      }
      setTimeout(() => {
        context.setActiveStep(4);
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="bg-glack">
      <Button
        variant="outlined"
        sx={{ border: "1px solid #fff", bgcolor: "black" }}
        onClick={handleUpload}
      >
        <p className="max-md:text-[0.5rem] text-[#fff]">Upload</p>
      </Button>
    </div>
  );
};

export default UploadComponent;
