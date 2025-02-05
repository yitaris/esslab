import { createBrowserRouter } from "react-router-dom";

/* Pages */
import App from "./App.jsx";
import SignIn from "./pages/(auth)/signIn.jsx";
import Home from "./pages/(tabs)/home.jsx";
import Verify from "./pages/verify.jsx";
import BarSkt from "./pages/(tabs)/skt_control/barskt.jsx";
import Panel from "./pages/(tabs)/home/panel.jsx";

import ProtectedRoute from "./helpers/ProtectedRoute";
import ProtectedSignIn from "./helpers/protectedSignIn";
export const router = createBrowserRouter([
    { path: "/", element: <App /> },
    { path: "/skttakip/barskt", element: <BarSkt /> },
    { path: "/analizler/panel", element: <Panel /> },
    { path: "/signIn", 
      element: (
        <ProtectedSignIn>
            <SignIn /> 
        </ProtectedSignIn>
      )
    },
    { 
      path: "/verify",
      element: (
        <ProtectedRoute>
          <Verify /> 
        </ProtectedRoute>
      )
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    
]);