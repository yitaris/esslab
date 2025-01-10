import React, { useState, useEffect } from "react";
import { useSupabase } from "../context/SupabaseContext";
import { ubgida2 } from "../assets";

import { MdKeyboardArrowDown,MdSaveAs  } from "react-icons/md";
import { GiMilkCarton } from "react-icons/gi";
import { BiCoffeeTogo } from "react-icons/bi";
import { FaBottleDroplet } from "react-icons/fa6";
import { PiHamburgerFill } from "react-icons/pi";
import { LuCakeSlice } from "react-icons/lu";
import { RiRedPacketFill } from "react-icons/ri";

export default function Fetchpanel() {
  const { data, loading, fetchFullInventory, updateInventory } = useSupabase();
  const [editMode, setEditMode] = useState(null); // Tracks the item being edited
  const [editedValue, setEditedValue] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Tracks search input
  const [containerHeight, setContainerHeight] = useState(500); // Default height
  const [selectedCategory, setSelectedCategory] = useState("hepsi"); // Default category
  const [dropdownOpen, setDropdownOpen] = useState(false); // Tracks dropdown visibility

  const categories = ["paket", "bardak", "surup", "sut", "sandivic", "pasta"];

  useEffect(() => {
    fetchFullInventory(); // Fetch all items
    const updateContainerHeight = () => {
      const viewportHeight = window.innerHeight;
      const headerHeight = 150; // Approximate height for the fixed elements (adjust as needed)
      setContainerHeight(viewportHeight - headerHeight);
    };

    updateContainerHeight();
    window.addEventListener("resize", updateContainerHeight);
    return () => window.removeEventListener("resize", updateContainerHeight);
  }, []);

  const handleSave = async (id) => {
    await updateInventory(id, { productcount: editedValue });
    setEditMode(null);
  };

  // Filter data based on search term and selected category
  const filteredData = data.filter(
    (item) =>
      item.productname.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "hepsi" || item.category === selectedCategory)
  );

  if (loading)
    return (
      <div className="absolute inset-0 grid place-content-center">
        <img
          src={ubgida2}
          alt="Loading..."
          className="w-30 h-30 animate-pulse"
        />
      </div>
    );

  return (
    <div className="w-full h-full lg:p-10">
      <div className="bg-[#fbfbfbf5] w-full h-full lg:rounded-2xl p-5 grid grid-rows-[300px,1fr] gap-5">
        <div className="grid grid-cols-4 gap-5">
          <div className="bg-white flex items-center justify-center rounded-2xl">
            1
          </div>
          <div className="bg-white flex items-center justify-center rounded-2xl">
            1
          </div>
          <div className="bg-white flex items-center justify-center rounded-2xl">
            1
          </div>
          <div className="bg-white flex items-center justify-center rounded-2xl">
            1
          </div>
        </div>
        <div className="bg-white rounded-2xl">
          as
        </div>
      </div>
    </div>
  );
}