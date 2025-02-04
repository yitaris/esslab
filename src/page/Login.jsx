import React, { useState } from "react";
import { motion } from "framer-motion";
import { ubvideo,ubgidadark,ubgidalight } from "../assets";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/SupabaseContext";

const Login = ({}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState(null);

    const { user, signInUser } = UserAuth();
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        const { session, error } = await signInUser(email, password); // Use your signIn function
    
        if (error) {
          setError(error); // Set the error message if sign-in fails
    
          // Set a timeout to clear the error message after a specific duration (e.g., 3 seconds)
          setTimeout(() => {
            setError("");
          }, 3000); // 3000 milliseconds = 3 seconds
        } else {
          // Redirect or perform any necessary actions after successful sign-in
          navigate(`/dashboard`);
        }
    
        if (session) {
          closeModal();
          setError(""); // Reset the error when there's a session
        }
      };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    

    return (
        <div className="bg-[#121212] w-full h-full md:h-screen grid md:place-content-center relative p-10">
            <div className="w-full h-full grid md:grid-cols-2 gap-10">
                <motion.div
                    initial={{ opacity: 0, translateY: -50 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ duration: 1 }}
                    className="flex flex-col items-center text-white"
                >
                    <img src={ubgidalight} className="w-[150px] h-[150px]" />
                    <form  onSubmit={handleSignIn} className="w-full h-full max-w-sm flex flex-col items-center justify-evenly">
                        <motion.div
                            initial={{ opacity: 0, translateY: -50 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 1 }}
                            className="flex flex-col items-center">
                            <h1 className="text-3xl font-semibold mt-10">
                                ESPRESSO<span className="text-red-500">LAB</span>
                            </h1>
                            <p className="mt-2 font-semibold text-[#aaa9a9d3]"></p>
                        </motion.div>

                        <div>
                            <motion.div
                                initial={{ opacity: 0, translateY: -50 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ duration: 1 }}
                                className="mb-4 w-[320px] flex justify-center mt-10">
                                <div className="input flex flex-col w-fit static">
                                    <label
                                        htmlFor="email"
                                        className="text-gray-200 text-sm font-semibold relative top-2 ml-[7px] px-[3px] bg-[#121212] w-fit"
                                    >
                                        E-posta
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="border-[#aaa9a946] px-4 py-3 text-sm bg-[#121212] border-2 rounded-md w-[240px] focus:outline-none placeholder:text-gray-400"
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
                                className="mb-4 w-[320px] flex justify-center relative">
                                <div className="input flex flex-col w-fit static">
                                    <label
                                        htmlFor="password"
                                        className="text-gray-200 text-sm font-semibold relative top-2 ml-[7px] px-[3px] bg-[#121212] w-fit"
                                    >
                                        Şifre
                                    </label>
                                    <input
                                        id="password"
                                        type={passwordVisible ? "text" : "password"}
                                        className="border-[#aaa9a946] px-4 py-3 text-sm bg-[#121212] border-2 rounded-md w-[240px] focus:outline-none placeholder:text-gray-400"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-7 right-10 p-2 text-gray-400"
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
                            className="w-[240px] p-3 mt-4 hover:bg-[#333131] text-white rounded-md transition duration-500"
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
