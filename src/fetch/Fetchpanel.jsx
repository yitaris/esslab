import React, { useEffect, useState } from "react";
import { useSupabase } from "../context/SupabaseContext";
import { IoSearch } from "react-icons/io5";
import { motion } from "framer-motion";
import { ubgida } from "../assets";

export default function Fetchpanel() {
  const { inventoryData, fetchFullInventory, deleteInventory } = useSupabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState("");

  const fadeInVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification("");
    }, 3000); // Notification disappears after 3 seconds
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchFullInventory();
        setLoading(false);
      } catch (err) {
        console.error("Veri alma hatası:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchFullInventory]);

  useEffect(() => {
    if (inventoryData) {
      const filteredAndSortedData = inventoryData
        .filter((product) => {
          const remainingTime = calculateRemainingTime(product.zaman);
          return (
            remainingTime !== "Süre doldu" &&
            new Date(product.zaman) - new Date() <= 5 * 24 * 60 * 60 * 1000
          );
        })
        .sort((a, b) => new Date(a.zaman) - new Date(b.zaman));

      setFilteredData(filteredAndSortedData);
    }
  }, [searchQuery, inventoryData]);

  const calculateRemainingTime = (timestamp) => {
    const now = new Date();
    const futureDate = new Date(timestamp);
    const difference = futureDate - now;

    if (difference <= 0) {
      return { text: "Süre doldu", style: "text-red-500" };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    if (days === 0) {
      return { text: "Bugün son", style: "text-red-500" };
    }
    return { text: `${days} gün kaldı`, style: "text-yellow-500" };
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpSubmit = async () => {
    if (otp.join("") === "1234") {
      try {
        await deleteInventory(selectedProduct.id);
        setShowModal(false);
        setOtp(["", "", "", ""]);
        showNotification("Ürün başarıyla silindi!");
      } catch (error) {
        console.error("Ürün silme hatası:", error);
        showNotification("Ürün silme başarısız oldu!");
      }
    } else {
      showNotification("Yanlış şifre!");
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
      {notification && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[30%] h-[50px] fixed top-0 left-1/3 transform -translate-x-1/2 bg-[#18181b] text-white px-4 py-2 rounded-b-lg shadow-lg z-50 flex items-center justify-center font-bold"
        >
          {notification}
        </motion.div>
      )}
      <motion.div
        variants={fadeInVariant}
        className="bg-[#fbfbfbf5] relative w-full h-full rounded-lg lg:rounded-2xl p-5 grid gap-5 grid-rows-[30%,70%]"
      >
        <div className="w-full h-full bg-white rounded-2xl p-5 font-bold text-lg">
          KAMPÜS ESPRESSOLAB İHTİYAÇ
        </div>

        <div className="bg-white p-5 rounded-2xl relative flex flex-col h-full">
          <h1 className="font-bold mb-2 text-lg">SKT YAKLAŞAN ÜRÜNLER</h1>

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
                  className="w-full h-full rounded-lg flex flex-row gap-5 border-b py-5 items-center justify-between"
                >
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-gray-500">Ürün</span>
                    <img src={product.image_url} className="w-24 h-24 rounded-2xl object-cover" />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-gray-500">İsim</span>
                      <span className="font-bold block">{product.productname}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-500">Miktar</span>
                      <span className="font-bold block">{product.productcount}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-500">Kalan Süre</span>
                      <span className={`font-bold block ${calculateRemainingTime(product.zaman).style}`}>
                        {calculateRemainingTime(product.zaman).text}
                      </span>
                    </div>
                  </div>
                  <div className="h-full">
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="w-[30px] h-[30px] text-center items-center justify-center flex bg-red-400 rounded-md text-xl font-semibold hover:bg-red-600 text-white transition duration-500"
                    >
                      -
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center font-bold text-gray-500  flex items-center justify-center">
                Ürün bulunamadı
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
          onClick={() => {
            setShowModal(false);
            setOtp(["", "", "", ""]);
          }}
        >
          <div className="bg-white p-10 rounded-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-xl mb-4">Şifrenizi Onaylayın!</h2>
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="password"
                  maxLength="1"
                  className="w-10 h-10 text-center text-xl border rounded"
                  value={value}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                />
              ))}
            </div>
            <button
              onClick={handleOtpSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Onayla
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
