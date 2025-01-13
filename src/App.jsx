import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Inventory from "./page/Inventory";
import Register from "./page/Register";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/" 
                    element={<Login />} 
                />
                <Route 
                    path="/register"
                    element={<Register />} 
                />
                <Route
                    path="/inventory"
                    element={<Inventory />}
                />
            </Routes>
        </Router>
    );
};

export default App;
