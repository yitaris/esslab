import React, { useState } from "react";
import { motion } from "framer-motion";
import { esslabicon } from "../assets";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";

const Login = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { signIn } = useSignIn();
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        setIsLoading(true); // Yükleniyor ekranını başlat
        setErrorMessage(""); // Hata mesajını sıfırla

        try {
            const result = await signIn.attemptFirstFactor({ identifier: username, password });
            if (result.status === "complete") {
                // Oturum açma işlemi başarılı
                setShowLogin(false); // Giriş ekranını gizle
                setTimeout(() => {
                    navigate("/inventory"); // Başka bir sayfaya yönlendirme
                }, 2000); // 2 saniye sonra yönlendirme
            } else {
                throw new Error("Oturum açma tamamlanamadı.");
            }
        } catch (error) {
            console.error("Giriş hatası:", error);
            setIsLoading(false); // Yükleniyor ekranını durdur
            setErrorMessage("Kullanıcı adı veya şifre yanlış. Lütfen tekrar deneyin.");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-white relative overflow-hidden">
            {showLogin && !isLoading && (
                <motion.div
                    className="grid sm:grid-cols-2 grid-cols-1 gap-2 items-center justify-center"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: showLogin ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="p-5 h-full grid place-content-center sm:place-content-start">
                        <motion.img
                            src={esslabicon}
                            alt="Logo"
                            className="w-[150px] h-[130px]"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                        />
                        <div className="flex flex-col items-center sm:items-start">
                            <div className="text-[#b32017] text-xl font-bold">ESSPRESSOLAB</div>
                            <div className="text-[#b32017] text-xl font-bold">AGORA AVM</div>
                            <div className="text-[#b32017] text-xl font-bold">STOK</div>
                        </div>
                    </div>
                    <div className="bg-[#b32017] p-5 rounded-[17px]">
                        <h2 className="text-2xl font-mono text-white mb-4">Hoşgeldiniz</h2>
                        <form className="flex flex-col" onSubmit={handleLogin}>
                            <p className="text-md mb-1">Kullanıcı Adı</p>
                            <input
                                type="text"
                                name="username"
                                className="font-mono bg-white text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-100 focus:outline-none transition ease-in-out duration-500"
                                placeholder="Kullanıcı Adı"
                                required
                            />
                            <p className="text-md mb-1">Şifre</p>
                            <div className="relative mb-4">
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    name="password"
                                    className="font-mono bg-white text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none transition ease-in-out duration-500"
                                    placeholder="Şifre"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-3"
                                    onClick={togglePasswordVisibility}
                                >
                                    {passwordVisible ? <FaEyeSlash className="text-[#b32017]" /> : <FaEye className="text-[#b32017]" />}
                                </button>
                            </div>
                            {errorMessage && (
                                <p className="text-white text-sm mb-4">{errorMessage}</p>
                            )}
                            <button type="submit" className="bg-[#b32017] text-[#fff] font-bold py-2 px-4 rounded-md mt-4 w-[150px] self-center justify-center hover:bg-[#fff] hover:text-[#b32017] transition ease-in-out duration-500">
                                Giriş Yap
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}
            {(isLoading || !showLogin) && (
                <motion.img
                    src={esslabicon}
                    alt="Logo"
                    className="absolute w-[150px] h-[150px]"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 0.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    style={{ zIndex: 1 }}
                />
            )}
        </div>
    );
};

export default Login;
