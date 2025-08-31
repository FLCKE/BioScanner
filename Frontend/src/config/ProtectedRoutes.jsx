import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getUserPicture } from "../services/api";

export default function ProtectedRoutes({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  getUserPicture(localStorage.getItem("userId")).then((data) => {
    console.log("data", data);
    if (!data.imageUrl) {
      navigate("/PhotoUpload");
    }
  });

  return token ? children : <Navigate to="/login" />;
}
