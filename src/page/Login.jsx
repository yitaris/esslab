import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { esslabicon } from "../assets";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Yükleme durumu
    const navigate = useNavigate();

    // Oturum kontrolü
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                navigate("/inventory");
            } else {
                setLoading(false); // Eğer oturum yoksa yükleme biter
            }
        };
        checkSession();
    }, [navigate]);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;

            navigate("/inventory"); // Giriş başarılıysa yönlendirme
        } catch (error) {
            setError("Giriş başarısız: " + error.message);
        }
    };

    if (loading) {
        // Yükleme sırasında animasyon göster
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <motion.img
                    src={esslabicon}
                    alt="Logo"
                    className="w-[150px] h-[130px]"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                />
            </div>
        );
    }

    return (
        <div className="h-screen flex items-center justify-center bg-white relative overflow-hidden">
            <motion.div
                className="grid sm:grid-cols-2 grid-cols-1 gap-2 items-center justify-center"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="p-5 h-full grid place-content-center sm:place-content-start">
                    <motion.img
                        src={esslabicon}
                        alt="Logo"
                        className="w-[150px] h-[130px]"
                    />
                    <div className="flex flex-col items-center sm:items-start">
                        <div className="text-[#b32017] text-xl font-bold">ESSPRESSOLAB</div>
                        <div className="text-[#b32017] text-xl font-bold">AGORA AVM</div>
                        <div className="text-[#b32017] text-xl font-bold">STOK</div>
                    </div>
                </div>
                <div className="bg-[#b32017] p-5 rounded-[17px]">
                    <h2 className="text-2xl font-mono text-white mb-4">Hoşgeldiniz</h2>
                    <form onSubmit={handleLogin} className="flex flex-col">
                        <p className="text-md mb-1">Email</p>
                        <input
                            type="email"
                            name="email"
                            className="font-mono bg-white text-gray-900 border-0 rounded-md p-2 mb-4"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <p className="text-md mb-1">Şifre</p>
                        <div className="relative mb-4">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                name="password"
                                className="font-mono bg-white text-gray-900 border-0 rounded-md p-2 w-full"
                                placeholder="Şifre"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3"
                                onClick={togglePasswordVisibility}
                            >
                                {passwordVisible ? <FaEyeSlash className="text-[#b32017]" /> : <FaEye className="text-[#b32017]" />}
                            </button>
                        </div>
                        {error && <p className="text-white text-sm mb-2">{error}</p>}
                        <button
                            type="submit"
                            className="bg-[#b32017] text-[#fff] hover:bg-white hover:text-[#b32017] duration-500 font-bold py-2 px-4 rounded-md mt-4"
                        >
                            Giriş Yap
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
