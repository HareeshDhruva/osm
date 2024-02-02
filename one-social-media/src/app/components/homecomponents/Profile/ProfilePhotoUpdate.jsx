import { useContext } from "react";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import React from "react";
import ImageCrop from "../../imagecrop/crop";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import { UserContest } from "../../../Context/UserContest";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { adminData } from "@/app/utils/api";
import { useQuery } from "@tanstack/react-query";

const ProfilePhotoUpdate = ({ open, setOpen, mode }) => {
  const context = useContext(UserContest);

  const handleClose = () => {
    setOpen(false);
  };

  const steps = ["UPLOAD FILE", "CROP", "UPLOAD"];

  if (context.activeStep === 4) {
    handleClose();
  }

  const { data: Admin } = useQuery({ queryKey: ["Admin"], queryFn: adminData });

  return (
    <>
      <div className="">
        <Dialog fullScreen open={open} onClose={handleClose}>
          <div className="bg-black text-[#fff] h-screen">
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p className="max-md:hidden flex justify-between">{mode}</p>
              <Box sx={{ width: "100%" }}>
                <Stepper activeStep={context.activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>
                        <p className="text-[#fff]  max-md:text-[0.5rem]">
                          {label}
                        </p>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
              <IconButton onClick={handleClose}>
                <CloseIcon className="text-[white]" />
              </IconButton>
            </DialogTitle>
            {Admin && Admin?.profileUrl !== null ? (
              <img
                className="block mx-auto ring-4 rounded-[50%] h-[8rem] ring-gray-500"
                src={Admin?.profileUrl?.url}
                alt=""
              />
            ) : (
              <img
                className="block mx-auto ring-4 rounded-[50%] h-[8rem] ring-gray-500"
                src="default_profile.jpeg"
                alt=""
              />
            )}
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <ImageCrop mode={mode} />
              </Box>
            </DialogContent>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default ProfilePhotoUpdate;
