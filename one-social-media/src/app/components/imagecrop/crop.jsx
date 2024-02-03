"use client";
import axios from "axios";
import React, { useState, useRef, useContext } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { canvasPreview } from "./canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";
import "react-image-crop/dist/ReactCrop.css";
import { UserContest } from "@/app/Context/UserContest";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Slider from "@mui/material/Slider";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";
import { useQueryClient,useMutation } from "@tanstack/react-query";
import { makeApost, profileUpdate } from "@/app/utils/api";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCrop({ mode }) {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(1 / 1);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");

  const queryClient = useQueryClient();
  const context = useContext(UserContest);
  const { enqueueSnackbar } = useSnackbar();

  const handleOnChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSteps = () => {
    context.setActiveStep(1);
  };

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
      context.setActiveStep(1);
    }
  }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  const profile = useMutation({
    mutationFn:(data)=> profileUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Admin"] });
      context.setActiveStep(3);
      enqueueSnackbar("Peofile updated", {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
    },
  });

  const post = useMutation({
    mutationFn: (data)=> makeApost(description,data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      context.setActiveStep(3);
      enqueueSnackbar("Added a new Post", {
        autoHideDuration: 3000,
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
    },
  });

  async function onDownloadCropClick() {
    handleOpenLoading();
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );

    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    const date = Date.now();
    const imagename = `photo${date}`;

    const file = new File([blob], imagename, {
      type: "image/png",
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "SocilaMedia");
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/sociladb/image/upload`,
        formData
      );
      if (response.status == 200) {
        const url = response.data.url;
        const public_id = response.data.public_id;
        const data = { url, public_id };
        try {
          if (mode !== "MAKE POST") {
            profile.mutate(data);
          } else {
            post.mutate(data);
          }
        } catch (error) {
          enqueueSnackbar(error.message, {
            autoHideDuration: 3000,
            variant: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
          });
        }
      }
    } catch (error) {
      enqueueSnackbar(error.response.data.error.message, {
        autoHideDuration: 3000,
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
    }
    handleLoading();
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  //loading
  const handleLoading = () => {
    setLoading(false);
  };
  const handleOpenLoading = () => {
    setLoading(true);
  };

  return (
    <div>
      {mode === "MAKE POST" && (
        <div className="flex justify-center">
          <input
            type="text"
            className="bg-black text-white w-[90%] my-5 border-b-2 h-7 focus:outline-none focus:border-blue-400 p-2 max-md:text-[0.5rem]"
            placeholder="Description"
            name=""
            id=""
            onClick={handleSteps}
            onChange={handleOnChange}
          />
        </div>
      )}
      <div className="App flex justify-center items-center">
        <div className="w-1/2 justify-center items-center">
          <div className="flex justify-center font-semibold my-5 ">
            <Button
              component="label"
              variant="outlined"
              sx={{ border: "1px solid #fff" }}
              startIcon={<CloudUploadIcon sx={{ color: "#fff" }} />}
            >
              <p className="max-md:text-[0.5rem] text-[#fff]">Upload file</p>
              <VisuallyHiddenInput type="file" onChange={onSelectFile} />
            </Button>
          </div>

          {!!imgSrc && (
            <div className="flex justify-center items-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                minHeight={100}
                className="outline outline-2 outline-offset-2"
              >
                <img
                  className="md:h-[40vh]"
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </div>
          )}

          {!!completedCrop && (
            <div className="flex flex-col gap-5">
              <div className="flex justify-center items-center">
                <canvas
                  className="outline outline-4 outline-offset-2 h-[40vh] max-h-[30vh] hidden"
                  ref={previewCanvasRef}
                />
              </div>
              {/* new */}
              <div className="justify-center font-semibold hidden">
                <Box sx={{ width: 300 }}>
                  <Slider
                    disabled={!imgSrc}
                    size="small"
                    step={0.1}
                    max={5}
                    min={0.5}
                    type="number"
                    defaultValue={scale}
                    aria-label="Small"
                    valueLabelDisplay="auto"
                    onChange={(e) => setScale(Number(e.target.value))}
                  />
                </Box>
              </div>

              <div className=" justify-center font-semibold hidden">
                <Box sx={{ width: 300 }}>
                  <Slider
                    id="rotate-input"
                    disabled={!imgSrc}
                    size="small"
                    step={1}
                    max={360}
                    value={rotate}
                    min={0.5}
                    type="number"
                    defaultValue={scale}
                    aria-label="Small"
                    valueLabelDisplay="auto"
                    onChange={(e) =>
                      setRotate(
                        Math.min(180, Math.max(-180, Number(e.target.value)))
                      )
                    }
                  />
                </Box>
              </div>
              <div className="flex justify-center items-center md:gap-10 max-md:flex-col gap-5">
                <Button
                  variant="outlined"
                  sx={{ border: "1px solid #fff", bgcolor: "black" }}
                  onClick={onDownloadCropClick}
                >
                  <p className="max-md:text-[0.5rem] text-[#fff]">Upload</p>
                </Button>
              </div>
            </div>
          )}
        </div>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
          onClick={handleLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </div>
  );
}
