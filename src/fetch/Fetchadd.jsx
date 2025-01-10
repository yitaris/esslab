import React, { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { IoTime, IoSearch } from "react-icons/io5";
import { LuGalleryVerticalEnd } from "react-icons/lu";
import { ubgida } from "../assets";

export default function Fetchadd() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // Türkiye saatine göre tarih ve zaman ayarları
  useEffect(() => {
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

  const items = [
    { title: "Tümü", subtitle: "100 Ürün Var" },
    { title: "Paketler", subtitle: "50 Ürün Var" },
    { title: "Bardaklar", subtitle: "50 Ürün Var" },
    { title: "Sandviçler", subtitle: "50 Ürün Var" },
    { title: "Pastalar", subtitle: "25 Ürün Var" },
    { title: "Kurabiyeler", subtitle: "75 Ürün Var" },
    { title: "Kek", subtitle: "120 Ürün Var" },
    { title: "İçecekler", subtitle: "120 Ürün Var" },
    { title: "GrapGo", subtitle: "120 Ürün Var" },
  ];

  return (
    <div className="w-full h-full lg:p-10">
      <div className="bg-[#fbfbfbf5] w-full h-full lg:rounded-2xl p-5 grid grid-rows-[50px,130px,50px,1fr] gap-5">
        {/* Date and Time Section */}
        <div className="grid grid-cols-[250px,10px,150px] gap-2">
          <div className="bg-white flex items-center rounded-2xl px-3 shadow-md">
            <div className="bg-[#3c3b3ba6] p-2 flex justify-center items-center rounded-full">
              <FaCalendarAlt fill="white" />
            </div>
            <span className="ml-3 text-gray-700 capitalize font-bold">
              {currentDate}
            </span>
          </div>
          <span className="flex items-center text-2xl">-</span>
          <div className="bg-white flex items-center rounded-2xl px-3 shadow-md">
            <div className="bg-[#3c3b3ba6] p-2 flex justify-center items-center rounded-full">
              <IoTime fill="white" />
            </div>
            <span className="ml-3 text-gray-700 font-bold">{currentTime}</span>
          </div>
        </div>

        {/* Category Section */}
        <div className="flex space-x-4">
          {items.map((item, index) => (
            <div key={index} className="bg-white w-[130px] h-[130px] rounded-2xl flex flex-col justify-between p-3 shadow-md">
              <div className="bg-[#3c3b3ba6] w-[30px] h-[30px] flex items-center justify-center p-1 rounded-full">
                <LuGalleryVerticalEnd fill="#fff" stroke="white" />
              </div>
              <span className="font-bold">{item.title}</span>
              <span>{item.subtitle}</span>
            </div>
          ))}
        </div>

        {/* Product Search */}
        <div className="bg-white w-[715px] rounded-2xl p-3 flex justify-between items-center shadow-md">
          <span className="text-gray-400">Ürünleri adı ile arayabilirsiniz...</span>
          <div className="bg-[#807f7f] p-2 rounded-2xl">
            <IoSearch fill="white" />
          </div>
        </div>

        {/* Product List */}
        <div className="flex gap-5">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="bg-white w-[180px] h-[200px] rounded-2xl grid grid-rows-[2fr-1fr] p-2 gap-3 shadow-md">
              <div className="rounded-2xl bg-[#f2f2f2] grid place-content-center">
                <img src={ubgida} className="w-20 h-20" />
              </div>
              <div className="flex flex-col justify-around">
                <span className="font-bold">Ürün Adı</span>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-orange-500">Ürün Kategorisi</span>
                  <button className="text-lg mr-2">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
