import React, { useState, useEffect } from "react";
import { useSupabase } from "../context/SupabaseContext";
import { esslabicon } from "../assets";

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
  }, []);

  useEffect(() => {
    // Adjust the height based on the window size
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
    fetchFullInventory(); // Refresh inventory after update
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
          src={esslabicon}
          alt="Loading..."
          className="w-20 h-20 animate-pulse"
        />
      </div>
    );

  return (
    <div className="w-full h-full lg:px-10 relative">
      <div className="bg-gray-50 rounded-2xl shadow-lg p-5 h-full relative">
        {/* Search Bar */}
        <div className="mb-4 mt-4 grid place-content-center">
          <input
            type="text"
            placeholder="Ürün adı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white w-[300px] px-4 py-2 border rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        {/* Header for All Items */}
        <div className="grid grid-cols-[1fr,2fr,2fr,1fr] text-lg font-semibold text-green-500 border-b pb-2 mb-2">
          <div className="">
            {/* Dropdown Filter for Categories */}
            <div className="relative mb-4">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="gap-2 w-auto flex justify-between items-center focus:text-red ring-0"
              >
                <span className="hidden lg:block">Ürün</span>
                <span>Kategori</span>
                <MdKeyboardArrowDown size={25} />
              </button>
              {dropdownOpen && (
                <div className="absolute z-10 bg-white w-[90px] border rounded-2xl shadow-md mt-2 ml-[50px]">
                  <ul className="divide-y divide-gray-200">
                    <li
                      onClick={() => {
                        setSelectedCategory("hepsi");
                        setDropdownOpen(false);
                      }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 font-light text-black"
                    >
                      Hepsi
                    </li>
                    {categories.map((category) => (
                      <li
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setDropdownOpen(false);
                        }}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-black font-light"
                      >
                        {category}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="gap-2 flex">
            <span className="hidden lg:block">Ürün</span>
            <span>İsmi</span>
          </div>
          <div className="gap-2 flex">
            <span className="hidden lg:block">Ürün</span>
            <span>Adet</span>
          </div>
          <div className="gap-2 flex justify-center lg:justify-start">
            Aksiyon
          </div>
        </div>

        {/* All Filtered Data */}
        <div
          className="overflow-y-auto scrollbar-hide"
          style={{ maxHeight: `${containerHeight}px` }}
        >
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr,2fr,2fr,1fr] items-center py-2 border-b last:border-b-0 text-sm"
            >
              <div className="flex gap-2 items-center">
                {item.category === "paket" && (
                  <RiRedPacketFill fill="red"/>
                  )}
                  {item.category === "surup" && (
                  <FaBottleDroplet fill="red"/>
                  )}
                  {item.category === "sut" && (
                  <GiMilkCarton fill="red"/>
                  )}
                  {item.category === "pasta" && (
                  <LuCakeSlice fill="red" stroke="white"/>
                  )}
                  {item.category === "sandivic" && (
                  <PiHamburgerFill fill="red" stroke="white"/>
                  )}
                   {item.category === "bardak" && (
                  <BiCoffeeTogo fill="red" stroke="white"/>
                  )}
                  {item.category}
              </div>
              <div>{item.productname}</div>
              <div className="">
                {editMode === item.id ? (
                  <input
                    type="number"
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    className="w-[50px] px-2 py-1 border rounded bg-white"
                  />
                ) : (
                  item.productcount
                )}
              </div>
              <div>
                {editMode === item.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(item.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      <MdSaveAs />
                    </button>
                    <button
                      onClick={() => setEditMode(null)}
                      className="bg-red text-white px-3 py-1 rounded"
                    >
                      X
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditMode(item.id);
                      setEditedValue(item.productcount);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Düzenle
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}