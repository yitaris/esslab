import { useContext, useState } from "react";

import { Link } from "react-router-dom";
import Login from "./page/Login";

import { UserAuth } from "./context/SupabaseContext";

function App() {
  const { user } = UserAuth();

  // console.log(user);

  return (
    <>
      <Login />
    </>
  );
}

export default App;