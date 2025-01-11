import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { esslablogodark, ubgida } from "../assets";
import { LuPanelsLeftBottom } from "react-icons/lu";
import { RiFileExcel2Line } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { FaPowerOff, FaBars } from "react-icons/fa";

import Fetchrapor from "../fetch/Fetchrapor";
import Fetchadd from "../fetch/Fetchadd";

const Inventory = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("panel");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setMenuOpen(false);
  };

  const categories = [
    { icon: <LuPanelsLeftBottom size={25} />, text: "Panel", category: "panel" },
    { icon: <RiFileExcel2Line size={25} />, text: "Rapor", category: "rapor" },
    { icon: <RiFileExcel2Line size={25} />, text: "SKT", category: "skt" },
    { icon: <IoMdAdd size={25} />, text: "Ekle", category: "ekle" },
    { icon: <FaPowerOff size={25} />, text: "Çıkış", category: "logout" },
  ];

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const logoVariants = {
    hidden: { y: "-100%", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } },
  };

  const contentVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.6 } },
  };

  return (
    <div className="w-full h-full relative bg-[#121212] text-black">
      {/* Header */}
      <motion.div
        className="w-full flex justify-between items-center bg-[#121212] p-4 lg:hidden"
        initial="hidden"
        animate="visible"
        variants={logoVariants}
      >
        <img src={ubgida} className="w-20" alt="Logo" />
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <FaBars size={30} className="text-white" />
        </button>
      </motion.div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-[#121212] z-10">
          <div className="flex flex-col items-center py-5 space-y-4">
            {categories.map((item, index) => (
              <button
                key={index}
                className="w-full text-white px-4 py-2 rounded-lg transition-all duration-300"
                onClick={() =>
                  index === 4 ? handleLogout() : handleCategoryClick(item.category)
                }
              >
                <div className="flex items-center hover:bg-[#333] rounded-lg p-2 transition-all duration-300">
                  {item.icon}
                  <span className="ml-2">{item.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="w-full h-screen grid lg:grid-cols-[70px,1fr]">
        {/* Sidebar for larger screens */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={sidebarVariants}
        >
          <img src={ubgida} className="w-20 absolute top-5 left-4 hidden lg:block" />
          <div className="w-full bg-[#aaa9a946] rounded-tr-2xl rounded-br-2xl relative group transition-all duration-300">
            <div className="flex flex-col items-center py-5 space-y-4">
              {categories.map((item, index) => (
                <button
                  key={index}
                  className="grid grid-cols-[42px,1fr] items-center w-full text-white px-4 py-2 rounded-lg transition-all duration-300"
                  onClick={() =>
                    index === 4 ? handleLogout() : handleCategoryClick(item.category)
                  }
                >
                  <div
                    className="hover:bg-[#121212] rounded-xl p-2 transition-all duration-300 transform hover:scale-105"
                    style={{ transitionTimingFunction: "ease-in-out" }}
                  >
                    {item.icon}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="h-screen"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
        >
          {selectedCategory === "rapor" && <Fetchrapor />}
          {selectedCategory === "ekle" && <Fetchadd />}
        </motion.div>
      </div>
    </div>
  );
};

export default Inventory;
