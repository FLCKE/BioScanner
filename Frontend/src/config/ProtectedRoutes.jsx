import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getUserPicture } from "../services/api";
import { useEffect } from "react";

export default function ProtectedRoutes({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      getUserPicture(localStorage.getItem("userId")).catch(() => {
        navigate("/PhotoUpload");
      });
    }
  }, [token, navigate]);

  return token ? children : <Navigate to="/login" />;
}
