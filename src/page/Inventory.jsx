import React from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate("/");
        } catch (error) {
            console.error("Çıkış işlemi sırasında bir hata oluştu:", error);
        }
    };

    return (
        <div className="h-screen bg-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold">Inventory Sayfası</h1>
            <button
                onClick={handleSignOut}
                className="mt-4 py-2 px-6 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
                Oturumdan Çık
            </button>
        </div>
    );
};

export default Inventory;
