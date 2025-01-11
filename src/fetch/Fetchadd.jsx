import React, { useState, useEffect } from "react";
import { useSupabase } from "../context/SupabaseContext";

import { IoTime, IoSearch } from "react-icons/io5";
import { FaCalendarAlt,FaBorderAll } from "react-icons/fa";
import { PiHamburgerFill } from "react-icons/pi";
import { LuCakeSlice } from "react-icons/lu";
import { RiDrinksLine } from "react-icons/ri";

export default function Fetchadd() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, loading, fetchProduct } = useSupabase();

  // Tarih ve zaman ayarı
  useEffect(() => {
    fetchProduct();
    const updateDateTime = () => {
      const now = new Date();
      const optionsDate = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Europe/Istanbul",
      };

      const optionsTime = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Europe/Istanbul",
      };

      setCurrentDate(new Intl.DateTimeFormat("tr-TR", optionsDate).format(now));
      setCurrentTime(new Intl.DateTimeFormat("tr-TR", optionsTime).format(now));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Kategorileri oluştur
  useEffect(() => {
    if (data.length > 0) {
      const categoriesData = ["Tümü", ...new Set(data.map((item) => item.category))];
      const categoryWithCounts = categoriesData.map((category) => {
        const count = category === "Tümü" ? data.length : data.filter((item) => item.category === category).length;
        return { name: category, count };
      });
      setCategories(categoryWithCounts);
      setFilteredProducts(data);
    }
  }, [data]);

  // Kategori ve arama filtresi
  useEffect(() => {
    let filtered = data;
    if (selectedCategory !== "Tümü") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, data]);

  return (
    <div className="w-full h-full p-5 lg:p-10">
    <div className="bg-[#fbfbfbf5] w-full h-full rounded-lg lg:rounded-2xl p-5 grid gap-5 grid-rows-[auto,auto,auto,1fr]">
      {/* Tarih ve Saat */}
      <div className="grid grid-cols-1 sm:grid-cols-[250px,10px,150px] gap-2 px-2">
        <div className="bg-white flex items-center rounded-lg lg:rounded-2xl p-3 shadow-md">
          <div className="bg-[#3c3b3ba6] p-2 flex justify-center items-center rounded-full">
            <FaCalendarAlt fill="white" />
          </div>
          <span className="ml-3 text-gray-700 capitalize font-bold text-sm lg:text-base">
            {currentDate}
          </span>
        </div>
        <span className="hidden sm:flex items-center text-2xl">-</span>
        <div className="bg-white flex items-center rounded-lg lg:rounded-2xl p-3 shadow-md">
          <div className="bg-[#3c3b3ba6] p-2 flex justify-center items-center rounded-full">
            <IoTime fill="white" />
          </div>
          <span className="ml-3 text-gray-700 font-bold text-sm lg:text-base">
            {currentTime}
          </span>
        </div>
      </div>

      {/* Kategori Kutuları */}
      <div className="flex space-x-4 p-2 w-full overflow-x-auto scrollbar-hide">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(category.name)}
            className={`bg-white flex-shrink-0 w-[30vw] sm:w-[130px] h-[130px] rounded-lg lg:rounded-2xl flex flex-col justify-between p-3 shadow-md cursor-pointer ${
              selectedCategory === category.name ? "ring-2 ring-gray-500" : ""
            }`}
          >
            {index === 0 && (
              <FaBorderAll fill={`${selectedCategory === category.name ? "#121212" : "gray"}`} size={30} />   
            )}
            {index === 1 && (
              <PiHamburgerFill fill={`${selectedCategory === category.name ? "#f97316" : "orange"}`} size={30} />   
            )}
            {index === 2 && (
              <LuCakeSlice stroke="white" fill={`${selectedCategory === category.name ? "purple" : "pink"}`} size={30} />   
            )}
            {index === 3 && (
              <RiDrinksLine fill={`${selectedCategory === category.name ? "#789DBC" : "#D9EAFD"}`} size={30} />   
            )}

            <span className="font-bold text-sm lg:text-base">{category.name}</span>
            <span className="text-xs lg:text-sm">{category.count} Ürün Var</span>
          </div>
        ))}
      </div>

      {/* Arama Çubuğu */}
      <div className="p-2">
        <div className="bg-white w-full rounded-lg lg:rounded-2xl p-3 flex justify-between items-center shadow-md">
          <input
            type="text"
            placeholder="Ürün adı ile arayın..."
            className="focus:outline-none w-full text-sm lg:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="bg-[#bb3838] p-2 rounded-full flex items-center justify-center">
            <IoSearch fill="white" />
          </div>
        </div>
      </div>

      {/* Ürün Listesi */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-5 overflow-y-auto max-h-[600px] p-2">
        {filteredProducts.map((item, index) => (
          <div
            key={index}
            className="bg-white w-full h-[260px] rounded-lg lg:rounded-2xl grid grid-rows-[4fr,2fr,1fr] p-2 shadow-md"
          >
            {/* Resim Bölgesi */}
            <div className="w-full h-full rounded-lg lg:rounded-2xl flex justify-center items-center overflow-hidden">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Ürün Adı */}
            <span className={`font-bold line-clamp-2 text-sm lg:text-base flex items-center`}>
              {item.name}
            </span>

            {/* Kategori ve Buton */}
            <div className="flex justify-between items-center">
              <span className={`${item.category === "Sandviç" ? "text-orange-500" : item.category === "Tatlı" ? "text-[#800080]" : item.category === "İçecekler" ? "text-[#789dbc]" : ""} text-xs lg:text-sm font-semibold`}>
                {item.category}
              </span>
              <button className="text-lg mr-2">+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}
