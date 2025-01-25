import { createBrowserRouter } from "react-router-dom";

/* Pages */
import App from "./App.jsx";
import Login from "./page/Login";
import Profile from "./page/Profile.jsx";
import Dashboard from "./page/Dashboard.jsx";
import ProtectedRoute from "./helpers/ProtectedRoute";

export const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/login", element: <Login /> },
    { path: "/profile", element: <Profile /> },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
]);