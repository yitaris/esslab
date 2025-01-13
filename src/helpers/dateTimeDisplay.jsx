import React, { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import { TbArrowBarLeft } from "react-icons/tb";
import { motion } from "framer-motion";

export default function DateTimeDisplay({ setOpenProductList }) {
    const [currentDate, setCurrentDate] = useState("");
    const [currentTime, setCurrentTime] = useState("");
    const fadeInVariant = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setCurrentDate(
                new Intl.DateTimeFormat("tr-TR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }).format(now)
            );
            setCurrentTime(
                new Intl.DateTimeFormat("tr-TR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }).format(now)
            );
        };
        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <motion.div
            variants={fadeInVariant}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-[250px,10px,1fr] gap-2 px-2"
        >
            <div className="bg-white flex items-center rounded-lg lg:rounded-2xl p-3 shadow-md">
                <div className="bg-[#3c3b3ba6] p-2 flex justify-center items-center rounded-full">
                    <FaCalendarAlt fill="white" />
                </div>
                <span className="ml-3 text-gray-700 capitalize font-bold text-sm lg:text-base">
                    {currentDate}
                </span>
            </div>
            <span className="hidden sm:flex items-center text-2xl">-</span>
            <div className="grid grid-cols-[150px,1fr] gap-2">
                <div className="bg-white flex items-center rounded-lg lg:rounded-2xl p-3 shadow-md">
                    <div className="bg-[#3c3b3ba6] p-2 flex justify-center items-center rounded-full">
                        <IoTime fill="white" />
                    </div>
                    <span className="ml-3 text-gray-700 font-bold text-sm lg:text-base">
                        {currentTime}
                    </span>
                </div>
                <div className="flex justify-end">
                    <div onClick={setOpenProductList} className="bg-white p-5 rounded-2xl cursor-pointer hover:bg-gray-300 duration-500">
                        <TbArrowBarLeft size={25} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
