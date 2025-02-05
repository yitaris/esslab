import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';
import { AuthContextProvider } from './context/SupabaseContext.jsx';
//import { AuthContextProvider } from './context/AuthContext.tsx';
import "./index.css"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>
);