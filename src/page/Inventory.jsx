import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { esslablogodark } from "../assets";
import Logoutbtn from "../hoc/logoutbtn";

//icons//
import { LuPanelsLeftBottom } from "react-icons/lu";
import { RiFileExcel2Line } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";

//page//
import Fetchpanel from "../fetch/Fetchpanel";
import Fetchrapor from "../fetch/Fetchrapor";

const Inventory = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("panel");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const categories = [
    { icon: <LuPanelsLeftBottom size={25} />, text: "Panel", category: "panel" },
    { icon: <RiFileExcel2Line size={25} />, text: "Rapor", category: "rapor" },
    { icon: <RiFileExcel2Line size={25} />, text: "Bardaklar", category: "bardaklar" },
    { icon: <RiFileExcel2Line size={25} />, text: "Şuruplar", category: "suruplar" },
    { icon: <RiFileExcel2Line size={25} />, text: "Sütler", category: "sutler" },
    { icon: <IoMdAdd size={25} />, text: "Ekle", category: "ekle" },
  ];

  return (
    <div className="w-full h-screen relative bg-[#fff] text-black grid grid-rows-[100px,auto]">
      {/* Header */}
      <div className="grid grid-cols-2 items-center px-10 border">
        <img src={esslablogodark} className="w-[180px]" />
        <button className="flex justify-end" onClick={handleLogout}>
          <Logoutbtn />
        </button>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-[70px,1fr] gap-20 lg:py-10 relative">
        {/* Sidebar for larger screens */}
        <div className="hidden lg:flex bg-red rounded-tr-2xl rounded-br-2xl self-center relative group transition-all duration-300 w-[70px] hover:w-[150px]">
          <div className="flex flex-col items-center py-5 space-y-4">
            {categories.map((item, index) => (
              <button
                key={index}
                className="grid grid-cols-[42px,1fr] items-center w-full text-white px-4 py-2 rounded-lg transition-all duration-300"
                onClick={() => handleCategoryClick(item.category)}
              >
                <div
                  className="hover:bg-red-600 rounded-xl p-2 transition-all duration-300 transform hover:scale-105"
                  style={{ transitionTimingFunction: "ease-in-out" }}
                >
                  {item.icon}
                </div>
                <span
                  className="ml-2 hidden group-hover:inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ transitionTimingFunction: "ease-in-out" }}
                >
                  {item.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Tabs for smaller screens */}
        <div className="fixed bottom-0 left-0 w-full flex justify-center items-center  lg:hidden z-50">
  <div className="flex justify-around w-full bg-red p-3 self-center">
    {categories.map((item, index) => (
      <button
        key={index}
        className={`flex flex-col items-center text-white ${selectedCategory === item.category ? "text-white" : "text-gray-300"}`}
        onClick={() => handleCategoryClick(item.category)}
      >
        {item.icon}
        <span className="text-xs">{item.text}</span>
      </button>
    ))}
  </div>
</div>

        {/* Main Content */}
        <div className="relative pb-[100px] lg:pb-0">
          {selectedCategory === "panel" && <Fetchpanel />}
          {selectedCategory === "rapor" && <Fetchrapor />}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
