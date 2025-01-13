import React, { useEffect, useState } from "react";
import { useSupabase } from "../context/SupabaseContext";
import { IoSearch } from "react-icons/io5";
import { motion } from "framer-motion";
import { ubgida } from "../assets";


export default function Fetchpanel() {
  const { inventoryData, fetchFullInventory } = useSupabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true); // Veri yükleniyor kontrolü

  const fadeInVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchFullInventory(); // Veriyi al
        setLoading(false); // Yükleme tamamlandığında loading false yap
      } catch (err) {
        console.error("Veri alma hatası:", err);
        setLoading(false); // Yükleme tamamlanmış sayılır
      }
    };
    fetchData();
  }, [fetchFullInventory]);

  useEffect(() => {
    if (inventoryData) {
      const filteredAndSortedData = inventoryData
        .filter((product) => {
          const remainingTime = calculateRemainingTime(product.zaman);
          // Sadece süresi 5 gün veya daha az olanları filtrele
          return (
            remainingTime !== "Süre doldu" &&
            new Date(product.zaman) - new Date() <= 5 * 24 * 60 * 60 * 1000
          );
        })
        .sort((a, b) => new Date(a.zaman) - new Date(b.zaman)); // Süresi dolmuşlardan başlayarak sırala
      
      setFilteredData(filteredAndSortedData);
    }
  }, [searchQuery, inventoryData]);

  const calculateRemainingTime = (timestamp) => {
    const now = new Date();
    const futureDate = new Date(timestamp);
    const difference = futureDate - now;
  
    if (difference <= 0) {
      return "Süre doldu";
    }
  
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    if (days === 0) {
      return "Bugün son";
    }
    return `${days} gün kaldı`;
  };

  if (loading) {
    return (
      <div className="absolute inset-0 grid place-content-center">
        <img
          src={ubgida}
          alt="Loading..."
          className="w-30 h-30 animate-pulse"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 1 }}
      className="w-full h-full lg:p-10 relative"
    >
      <motion.div
        variants={fadeInVariant}
        className="bg-[#fbfbfbf5] relative w-full h-full rounded-lg lg:rounded-2xl p-5 grid gap-5 grid-rows-2"
      >
        <div className="w-full h-full bg-white rounded-2xl p-5">
          1
        </div>

        <div className="bg-white p-5 rounded-2xl relative flex flex-col h-full">
          <h1 className="font-bold mb-2">SKT YAKLAŞAN ÜRÜNLER</h1>

          {/* Search Bar */}
          <div className="bg-gray-100 rounded-full flex items-center p-2">
            <IoSearch size={20} className="text-gray-600" />
            <input
              type="text"
              placeholder="Ürün ara..."
              className="bg-transparent focus:outline-none px-2 py-1 w-full text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Carousel Container */}
          <div className="overflow-y-scroll grid gap-5 w-full h-full">
            {filteredData.length > 0 ? (
              filteredData.map((product) => (
                <div
                  key={product.id}
                  className="w-full h-full rounded-lg flex flex-row gap-5 border-b py-5"
                >
                  <img src={product.image_url}
                       className="w-24 h-24 rounded-2xl object-cover"
                  />
                  <span className="font-bold">{product.productname}</span>
                  <span className="font-bold">Miktar: {product.productcount}</span>
                  <span className="font-bold">{calculateRemainingTime(product.zaman)}</span>
                </div>
              ))
            ) : (
              <div className="w-full text-center font-bold text-gray-500">
                Ürün bulunamadı
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
