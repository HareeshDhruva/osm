"use client";
import { createContext, useState } from "react";
export const UserContest = createContext(null);

function PhotoContestProvider({ children }) {
  const [photo, setPhoto] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  return (
    <UserContest.Provider
      value={{
        photo,
        setPhoto,
        activeStep,
        setActiveStep
      }}
    >
      {children}
    </UserContest.Provider>
  );
}
export default PhotoContestProvider;
