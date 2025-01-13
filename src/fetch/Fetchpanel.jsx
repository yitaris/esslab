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
    // `data` geldiğinde filtreleme işlemini yap
    if (inventoryData) {
      console.log("Veri geldi:", inventoryData); // Burada veriyi konsola yazdırıyoruz
      setFilteredData(
        inventoryData.filter((product) =>
          product.productname.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
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
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (months > 0) {
      return `${months} ay kaldı`;
    } else if (weeks > 0) {
      return `${weeks} hafta kaldı`;
    } else {
      return `${days} gün kaldı`;
    }
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
        className="bg-[#fbfbfbf5] relative w-full h-full rounded-lg lg:rounded-2xl p-5 grid gap-5 grid-rows-[auto,1fr]"
      >
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
          <div className="overflow-x-auto flex space-x-4 snap-x snap-mandatory h-full">
            {filteredData.length > 0 ? (
              filteredData.map((product) => (
                <div
                  key={product.id}
                  className="min-w-full flex-shrink-0 rounded-lg flex flex-col items-center snap-center p-3"
                >
                  <div className="flex flex-col items-center justify-between p-3 rounded-lg">
                    <img
                      src={product.image_url}
                      className="w-[130px] h-[130px] object-cover mb-2 rounded-lg"
                      alt={product.productname}
                    />
                    <span className="w-full text-center mt-2 p-1 rounded-lg text-black font-bold">
                      {product.productname}
                    </span>
                    <div className="text-center">
                      <h3 className="text-white font-bold">Kalan Zaman</h3>
                      <span className="bg-purple-500 text-white p-3 rounded-lg">
                        {calculateRemainingTime(product.zaman)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center font-bold text-gray-500">
                Ürün bulunamadı
              </div>
            )}
          </div>
        </div>
        <div className="w-full">
        </div>
      </motion.div>
    </motion.div>
  );
}
