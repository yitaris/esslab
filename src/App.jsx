import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react"; // Clerk'in oturum yönetimi için

import Login from "./page/Login";
import Inventory from "./page/Inventory";

const ProtectedRoute = ({ children }) => {
    const { isSignedIn } = useAuth(); // Kullanıcı oturum durumu
    return isSignedIn ? children : <Navigate to="/" />;
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Login />}
                />
                <Route
                    path="/inventory"
                    element={
                        <ProtectedRoute>
                            <Inventory />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
