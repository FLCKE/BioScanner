import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getUserPicture } from "../services/api";

export default function ProtectedRoutes({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const picture = getUserPicture(localStorage.getItem("userId"));
  if (!picture) {
    navigate("/PhotoUpload");
    return;
  }

  return token ? children : <Navigate to="/login" />;
}
