import React, { useContext } from "react";
import { Dialog, DialogTitle, Typography, Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ImageCrop from "../imagecrop/crop";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { UserContest } from "../../Context/UserContest";
const MakePost = ({ open, setPostOpen, mode }) => {
  const context = useContext(UserContest);

  const handleClose = () => {
    setPostOpen(false);
    context.setActiveStep(0);
  };

  const steps = ["DESCRIPTION", "UPLOAD FILE", "UPLOAD"];

  if (context.activeStep === 3) {
    handleClose();
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      sx={{ border: "2px solid #fff" }}
    >
      <div className=" bg-black text-[#fff] h-screen overflow-hidden">
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ textAlign: "center", fontFamily: "serif" }}
            className="max-md:hidden"
          >
            {mode}
          </Typography>
          <Box sx={{ width: "90%", bgcolor: "black" }}>
            <Stepper activeStep={context.activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>
                    <p className="text-[#fff] max-md:text-[0.5rem] bg-black">
                      {label}
                    </p>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <IconButton className="" onClick={handleClose}>
            <CloseIcon className="text-[white]" />
          </IconButton>
        </DialogTitle>
        <ImageCrop mode={mode} />
      </div>
    </Dialog>
  );
};

export default MakePost;
