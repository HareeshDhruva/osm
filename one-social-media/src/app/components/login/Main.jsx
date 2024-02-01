"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";

const Home = () => {
  const APP_URL = process.env.NEXT_PUBLIC_BACKEND;
  const { enqueueSnackbar } = useSnackbar();
  const loginData = { email: "", password: "" };
  const registerData = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    DOB: "",
    gender: "",
  };

  //state init
  const [logindata, setloginData] = useState(loginData);
  const [registerdata, setRegister] = useState(registerData);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [passwordResetRequest, setPasswordResetRequest] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  //onchane function
  const onValueChange = (e) => {
    e.preventDefault();
    setloginData({ ...logindata, [e.target.name]: e.target.value });
  };

  const onValue = (e) => {
    e.preventDefault();
    setRegister({ ...registerdata, [e.target.name]: e.target.value });
  };

  //register
  const onRegister = async () => {
    handleOpenLoading();
    try {
      const result = await axios.post(APP_URL + "/register", registerdata);
      if (result?.message === "Authentication failed") {
        localStorage.removeItem("user");
        window.alert("user session expair Login again. ");
        window.location.replace("/");
      }
      if (result.status === 200) {
        setRegister(registerData);
        enqueueSnackbar(result.data.message, {
          autoHideDuration: 2000,
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          preventDuplicate: false,
        });
      } else {
        enqueueSnackbar(result.data.message, {
          autoHideDuration: 2000,
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          preventDuplicate: false,
        });
      }

      handleLoading();
      setOpen(false);
    } catch (error) {
      handleLoading();
      enqueueSnackbar(result.data.message, {
        autoHideDuration: 2000,
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        preventDuplicate: false,
      });
    }
  };

  //login
  const onLogin = async () => {
    handleOpenLoading();
    try {
      const result = await axios.post(APP_URL + "/login", logindata, {
        withCredentials: true,
      });
      if (result.status === 200) {
        localStorage.setItem("user", result.data.data);
        setloginData(loginData);
        window.location.replace("/home");
        handleLoading();
      } else {
        handleLoading();
        enqueueSnackbar(result.data.message, {
          autoHideDuration: 2000,
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          preventDuplicate: false,
        });
      }
    } catch (error) {
      handleLoading();
    }
  };

  // dummy login

  const dummyLogin = async (e) => {
    handleOpenLoading();
    const data = {
      email: "test@gmail.com",
      password: "password",
    };
    try {
      const result = await axios.post(APP_URL + "/login", data, {
        withCredentials: true,
      });

      if (result.status === 200) {
        localStorage.setItem("user", result.data.data);
        window.location.replace("/home");
        handleLoading();
      } else {
        handleClick();
        handleLoading();
      }
    } catch (error) {
      handleLoading();
    }
  };

  // passwordRequest
  const passwordRequest = async () => {
    handleOpenLoading();
    if (resetEmail) {
      const response = await axios.post(
        APP_URL + "/user/password-reset-request",
        { email: resetEmail }
      );
      if (response.status === 200) {
        onHadlepasswordResetRequestClose();
        enqueueSnackbar(response.data.message, {
          autoHideDuration: 2000,
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          preventDuplicate: false,
        });
      } else {
        enqueueSnackbar(response.data.message, {
          autoHideDuration: 2000,
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          preventDuplicate: false,
        });
      }
      handleLoading();
    }
  };

  // state function
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  //loading

  const handleLoading = () => {
    setLoading(false);
  };

  const handleOpenLoading = () => {
    setLoading(true);
  };

  // paassword set onHadlepasswordResetRequest
  const onHadlepasswordResetRequest = () => {
    setPasswordResetRequest(true);
  };

  const onHadlepasswordResetRequestClose = () => {
    setPasswordResetRequest(false);
  };

  return (
    <div className="flex flex-col items-center text-[#fff]">
      <div className="rounded-[10px] w-max border shadow-lg md:w-[400px]">
        <div className="flex flex-col m-4">
          <input
            name="email"
            type="text"
            onKeyDown={(event) => {
              if (event.key === "Enter") onLogin();
            }}
            value={logindata.email}
            placeholder="Email Address"
            className="w-full border p-2 border-gray-400 text-white bg-black rounded-md focus:outline-none focus:ring-1 ring-white my-2"
            onChange={(e) => onValueChange(e)}
          />
          <input
            name="password"
            type="password"
            onKeyDown={(event) => {
              if (event.key === "Enter") onLogin();
            }}
            value={logindata.password}
            placeholder="Password"
            className="w-full border p-2 border-gray-400 text-white bg-black rounded-md focus:outline-none focus:border-white my-2"
            onChange={(e) => onValueChange(e)}
          />
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              className="bg-black ring-1 ring-gray-500 text-white px-4 py-2 rounded w-full font-bold uppercase"
              onClick={onLogin}
            >
              Log in
            </button>

            <button
              type="submit"
              className="bg-black ring-1 ring-gray-500 text-white px-4 py-2 rounded w-full font-bold uppercase"
              onClick={dummyLogin}
            >
              test account
            </button>
          </div>
          <button
            type="submit"
            className="text-white hover:underline mt-4 text-center font-bold"
            onClick={onHadlepasswordResetRequest}
          >
            forget password?
          </button>
          <hr className="text-black m-4" />
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-black ring-1 ring-gray-500 text-white px-4 py-2 rounded font-bold uppercase"
              onClick={handleOpen}
            >
              create new account
            </button>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="m-4">
          {" "}
          <span className="font-bold ">Create a Page</span> for a celebrity,
          brand or business.
        </p>
      </div>

      <Dialog open={open} onClose={handleClose} sx={{ zIndex: 1 }}>
        <div className="bg-black border-2 text-[#fff]">
          <DialogTitle>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, textTransform: "uppercase" }}
            >
              Sign Up
            </Typography>
            <Typography>It's quick and easy.</Typography>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Box sx={{ display: "flex", gap: 2 }}>
              <input
                type="text"
                id="firstname"
                name="firstname"
                placeholder="Firstname"
                className="w-full border p-2 bg-black border-gray-400 rounded-md focus:outline-none"
                value={registerdata.firstname}
                onChange={(e) => onValue(e)}
              />
              <input
                type="text"
                id="secondname"
                name="lastname"
                placeholder="Lastname"
                className="w-full border p-2 border-gray-400 bg-black rounded-md focus:outline-none "
                value={registerdata.lastname}
                onChange={(e) => onValue(e)}
              />
            </Box>
            <Box>
              <input
                type="text"
                id="email"
                placeholder="Email"
                name="email"
                value={registerdata.email}
                className="w-full border p-2 border-gray-400 bg-black rounded-md focus:outline-none my-2"
                onChange={(e) => onValue(e)}
              />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="w-full border p-2 border-gray-400 bg-black rounded-md focus:outline-none my-2"
                onChange={(e) => onValue(e)}
              />
            </Box>
            <Typography>Date of birth ?</Typography>
            <input
              type="date"
              id="name"
              name="DOB"
              className="w-full border p-2 border-gray-400 bg-black rounded-md focus:outline-none"
              onChange={(e) => onValue(e)}
            />

            <div className="flex justify-between my-4">
              <Typography>Gender ?</Typography>
              <select
                name="gender"
                id=""
                onChange={(e) => onValue(e)}
                className="px-5 py-3 rounded-lg ring-1 ring-gray-400 focus:outline-none bg-black"
              >
                <option intial>select</option>
                <option name="gender" value="male">
                  male
                </option>
                <option name="gender" value="female">
                  female
                </option>
                <option name="gender" value="other">
                  other
                </option>
              </select>
            </div>
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}
          >
            <button
              type="submit"
              className="bg-black ring-1 ring-gray-500 text-white px-4 py-2 rounded font-bold w-1/2 uppercase"
              onClick={(e) => onRegister(e)}
            >
              Sign Up
            </button>
          </DialogActions>
        </div>
      </Dialog>

      <Dialog open={passwordResetRequest} onClose={onHadlepasswordResetRequest}>
        <div className="border-2 bg-black text-[#fff]">
          <DialogTitle>
            <Typography
              variant="h4"
              sx={{ fontWeight: 600, textTransform: "uppercase" }}
            >
              <p className="max-md:text-[0.6rem] text-[1rem]  text-center">
                Password Reset
              </p>
            </Typography>
          </DialogTitle>
          <DialogContent>
            <input
              type="text"
              id=""
              placeholder="valid email"
              name="email"
              className="w-full border text-center p-2 border-gray-400 bg-black rounded-md focus:outline-none max-mdtext-[.5rem]  my-2"
              value={resetEmail}
              onKeyDown={(event) => {
                if (event.key === "Enter") passwordRequest();
              }}
              onChange={(e) => {
                setResetEmail(e.target.value);
              }}
            />
          </DialogContent>
          <DialogActions
            sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}
          >
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-black text-white hover:ring-1 ring-gray-500 px-4 py-2 rounded font-bold w-1/2 uppercase"
                onClick={onHadlepasswordResetRequestClose}
              >
                <p className="max-md:text-[0.5rem]">cancle</p>
              </button>

              <button
                type="submit"
                className="bg-black hover:ring-1 ring-gray-500 text-white px-4 py-2 rounded font-bold w-1/2 uppercase"
                onClick={passwordRequest}
              >
                <p className="max-md:text-[0.5rem]">send</p>
              </button>
            </div>
          </DialogActions>
        </div>
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={handleLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Home;
