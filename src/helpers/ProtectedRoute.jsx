import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/SupabaseContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { session } = UserAuth();

  if (session === undefined) {
    return <div>Loading...</div>;
  }

  return <div>{session ? <>{children}</> : <Navigate to="/login" />}</div>;
};

export default ProtectedRoute;