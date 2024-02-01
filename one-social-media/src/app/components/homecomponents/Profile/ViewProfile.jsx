import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import Input from "@/app/components/Input";
import { useQuery } from "@tanstack/react-query";
import { adminData } from "@/app/utils/api";

const ViewProfile = ({ open, setOpen }) => {
  const { data } = useQuery({ queryKey: ["Admin"], queryFn: adminData });
  const Admin = data;

  const viewClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={viewClose}>
        <DialogTitle>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            User Data
          </Typography>
          <Typography>It's quick and easy.</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Input
              type="text"
              id="firstname"
              name="firstname"
              placeholder="Firstname"
              value={Admin.firstname}
              onChange={(e) => onValue(e)}
            />
            <Input
              type="text"
              id="secondname"
              name="lastname"
              placeholder="Lastname"
              value={Admin.lastname}
              onChange={(e) => onValue(e)}
            />
          </Box>
          <Box>
            <Input
              type="text"
              id="email"
              disabled
              placeholder="Email"
              name="email"
              value={Admin.email}
            />
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              onChange={(e) => onValue(e)}
            />
          </Box>
          <Typography>Date of birth ?</Typography>
          <Input
            type="date"
            id="name"
            name="DOB"
            onChange={(e) => onValue(e)}
          />
          <Typography>Gender ?</Typography>
          <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
            <button className="flex gap-2">
              <Input
                type="button"
                name="gender"
                id="males"
                value="male"
                onClick={(e) => onValue(e)}
              />
            </button>
            <button className="flex gap-2 ">
              <Input
                type="button"
                name="gender"
                id="females"
                value="female"
                onClick={(e) => onValue(e)}
              />
            </button>
            <button className="flex gap-2">
              <Input
                type="button"
                name="gender"
                value="custom"
                id="custom"
                onClick={(e) => setHidden("visible")}
              />
            </button>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}
        >
          <button
            type="submit"
            className="bg-green-500 hover:bg-blue-800 text-white px-4 py-2 rounded font-bold w-1/2"
            onClick={(e) => onRegister(e)}
          >
            update
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewProfile;
