import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            alert("Kayıt başarılı! Lütfen e-postanızı kontrol edin.");
            navigate("/");
        } catch (error) {
            setError("Kayıt başarısız: " + error.message);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-white relative overflow-hidden">
            <form onSubmit={handleRegister} className="bg-[#b32017] p-5 rounded-[17px] flex flex-col w-[400px]">
                <h2 className="text-2xl font-mono text-white mb-4">Kayıt Ol</h2>
                <input
                    type="email"
                    placeholder="E-posta"
                    className="font-mono bg-white text-gray-900 border-0 rounded-md p-2 mb-4"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    className="font-mono bg-white text-gray-900 border-0 rounded-md p-2 mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <button
                    type="submit"
                    className="bg-[#b32017] text-[#fff] font-bold py-2 px-4 rounded-md"
                >
                    Kayıt Ol
                </button>
            </form>
        </div>
    );
};

export default Register;
