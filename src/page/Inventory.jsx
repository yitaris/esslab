import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { esslablogodark } from "../assets";
import Logoutbtn from "../hoc/logoutbtn";

//icons//
import { GiMilkCarton,  } from "react-icons/gi";
import { BiCoffeeTogo } from "react-icons/bi";
import { FaBottleDroplet } from "react-icons/fa6";
import { PiHamburgerFill } from "react-icons/pi";
import { LuCakeSlice, LuPanelsLeftBottom } from "react-icons/lu";
import { RiRedPacketFill  } from "react-icons/ri";

//page//
import Fetchpanel from "../fetch/Fetchpanel";
import Fetchpaket from "../fetch/Fetchpaket";
import Fetchbardak from "../fetch/Fetchbardak";
import Fetchsurup from "../fetch/Fetchsurup";
import FetchSut from "../fetch/Fetchsut";
import Fetchsandivic from "../fetch/Fetchsandivic";
import Fetchpasta from "../fetch/Fetchpasta";

const Inventory = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="w-full h-screen relative bg-[#ffffff] text-black grid grid-rows-[100px,auto]">
      {/* Header */}
      <div className="grid grid-cols-2 items-center px-10 border">
        <img src={esslablogodark} className="w-[180px]" />
        <button className="flex justify-end" onClick={handleLogout}>
          <Logoutbtn />
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-[70px,1fr] gap-20 py-10">
        {/* Sidebar */}
        <div className="bg-red rounded-tr-2xl rounded-br-2xl relative group transition-all duration-300 w-[70px] hover:w-[150px]">
          <div className="flex flex-col items-center py-5 space-y-4">
            {[
              { icon: <LuPanelsLeftBottom size={25} />, text: "Panel", category: "panel" },
              { icon: <RiRedPacketFill size={25} />, text: "Paketler", category: "paketler" },
              { icon: <BiCoffeeTogo size={25} />, text: "Bardaklar", category: "bardaklar" },
              { icon: <FaBottleDroplet size={25} />, text: "Şuruplar", category: "suruplar" },
              { icon: <GiMilkCarton size={25} />, text: "Sütler", category: "sutler" },
              { icon: <PiHamburgerFill size={25} />, text: "Sandviç", category: "sandvic" },
              { icon: <LuCakeSlice size={25} />, text: "Pastalar", category: "pastalar" },
            ].map((item, index) => (

              <button
                key={index}
                className="flex items-center justify-start w-full text-white px-4 py-2 hover:bg-red-600 rounded-lg transition-all duration-300"
                onClick={() => handleCategoryClick(item.category)}
              >
                <div
                  className="transition-transform duration-300 transform group-hover:translate-x-0"
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

        {/* Main Content */}
        <div className="relative">
            {/* Dynamic Content Based on Selected Category */}
          {selectedCategory === "panel" && <Fetchpanel />}
          {selectedCategory === "paketler" && <Fetchpaket />}
          {selectedCategory === "bardaklar" && <Fetchbardak />}
          {selectedCategory === "suruplar" && <Fetchsurup />}
          {selectedCategory === "sutler" && <FetchSut />}
          {selectedCategory === "sandvic" && <Fetchsandivic />}
          {selectedCategory === "pastalar" && <Fetchpasta />}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
