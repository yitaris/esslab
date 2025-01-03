import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react"; // Clerk hook'u
import Login from "./page/Login";
import Inventory from "./page/Inventory";

const App = () => {
    const { isSignedIn, isLoading: authLoading } = useAuth(); // isSignedIn ve isLoading

    // Kullanıcı giriş durumu değiştiğinde yönlendirme işlemi yapılacak
    useEffect(() => {
        if (isSignedIn && !authLoading) return; // Yükleme esnasında hiçbir şey yapma
    }, [[isSignedIn, authLoading]]);

    // Eğer kullanıcı giriş yapmamışsa Login'e yönlendir, giriş yapmışsa Inventory'ye yönlendir
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={isSignedIn ? <Navigate to="/inventory" /> : <Login />}
                />
                <Route
                    path="/inventory"
                    element={isSignedIn ? <Inventory /> : <Navigate to="/" />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
