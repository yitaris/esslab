import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { esslabicon, ubgida, ubvideo } from "../assets";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                navigate("/inventory");
            } else {
                setLoading(false);
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

            navigate("/inventory");
        } catch (error) {
            setError("Giriş başarısız: " + error.message);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <motion.img
                    src={ubgida}
                    alt="Logo"
                    className="w-[200px] h-[200px]"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                />
            </div>
        );
    }

    return (
        <div className="bg-[#121212] w-full h-full  md:h-screen grid md:place-content-center relative p-10">
            <div className="w-full h-full grid md:grid-cols-2 gap-10">
                <motion.div
                    initial={{ opacity: 0, translateY: -50 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center text-white"
                >
                    <img src={ubgida} className="w-20 h-20" />
                    <form onSubmit={handleLogin} className=" w-full h-full max-w-sm flex flex-col items-center justify-evenly">
                        <motion.div 
                            initial={{ opacity: 0, translateY: -50 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 1 }}
                            className="flex flex-col items-center">
                            <h1 className="text-3xl font-semibold mt-10">
                                ESSPRESSO<span className="text-red">LAB</span>
                            </h1>
                            <p className="mt-2 font-semibold text-[#aaa9a9d3]">AGORA AVM STOK</p>
                        </motion.div>
                        
                        <div>
                            <motion.div
                                initial={{ opacity: 0, translateY: -50 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ duration: 1 }}
                                className="mb-4 w-[300px] flex justify-center mt-10">
                                <div className="input flex flex-col w-fit static">
                                    <label
                                        for="input"
                                        className="text-gray-200 text-xs font-semibold relative top-2 ml-[7px] px-[3px] bg-[#121212] w-fit"
                                    >
                                        E-posta
                                    </label>
                                    <input
                                        type="email"
                                        className="border-[#aaa9a946] input px-[10px] py-[11px] text-xs bg-[#121212] border-2 rounded-[5px] w-[210px] focus:outline-none placeholder:text-black/25"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, translateY: -50 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ duration: 1 }}
                                className="mb-4 w-[300px] flex justify-center relative">
                                <div className="input flex flex-col w-fit static">
                                    <label
                                        for="input"
                                        className="text-gray-200 text-xs font-semibold relative top-2 ml-[7px] px-[3px] bg-[#121212] w-fit"
                                    >
                                        Şifre
                                    </label>
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        className="border-[#aaa9a946] input px-[10px] py-[11px] text-xs bg-[#121212] border-2 rounded-[5px] w-[210px] focus:outline-none placeholder:text-black/25"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-5 right-12 p-2 text-gray-400"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="w-[210px] p-2 mt-4 hover:bg-[#333131] text-white rounded-md transition duration-500"
                        >
                            Giriş Yap
                        </button>
                    </form>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, translateY: 50 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 1 }}
                    className="relative"
                >
                    <video
                        className="object-cover w-full h-full rounded-2xl"
                        autoPlay
                        muted
                        loop
                    >
                        <source src={ubvideo} type="video/mp4" />
                    </video>
                </motion.div>
            </div>
        </div>
    );
};
export default Login;
