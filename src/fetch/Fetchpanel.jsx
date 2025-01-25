import React, { useEffect, useState } from "react";
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
          const matchesSearchQuery = searchQuery
            ? product.productname.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
  
          // Aksiyon = "gelen" olanları filtreleme
          const matchesAction = product.aksiyon === "Gelen";
  
          return (
            remainingTime !== "Süre doldu" &&
            new Date(product.zaman) - new Date() <= 5 * 24 * 60 * 60 * 1000 &&
            matchesSearchQuery &&
            matchesAction
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
        className="bg-[#fbfbfbf5] relative w-full h-full lg:p-5 grid gap-5 grid-cols-12 md:grid-rows-12 auto-rows-[300px] lg:rounded-2xl"
      >
        <div className="w-full bg-white lg:rounded-2xl rounded-b-2xl p-5 font-bold text-lg col-span-12 md:row-span-4">
          <h1 className="font-bold mb-2 text-lg">KAMPÜS ESPRESSOLAB İHTİYAÇ</h1>
          <div>
            <span className="text-gray-500 font-normal">Ürün bulunamadı</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl flex flex-col w-full col-span-12 md:col-span-5 lg:col-span-4 md:row-span-8">
          <h1 className="font-bold mb-4 text-xl text-gray-800">SKT YAKLAŞAN ÜRÜNLER</h1>
          {/* Search Bar */}
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 mb-6 shadow-sm">
            <IoSearch size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Ürün ara..."
              className="bg-transparent focus:outline-none px-3 py-1 w-full text-sm text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Carousel Container */}
          <div className="overflow-y-auto max-h-[400px] divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 py-4">
                  <img
                    src={product.image_url}
                    alt="product"
                    className="w-20 h-20 rounded-lg object-cover shadow-sm"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm">{product.productname}</p>
                    <p className="text-gray-500 text-xs">Miktar: <span className="font-medium">{product.productcount}</span></p>
                    <p className="text-gray-500 text-xs">Kalan Süre: <span className={`font-medium ${calculateRemainingTime(product.zaman).style}`}>{calculateRemainingTime(product.zaman).text}</span></p>
                  </div>

                  <button
                    onClick={() => handleDeleteClick(product)}
                    className="w-6 h-6 flex self-start items-center justify-center bg-red-500 text-white rounded-lg text-2xl shadow-md hover:bg-red-600 transition">
                    -
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500 font-medium">
                Ürün bulunamadı
              </div>
            )}
          </div>
        </div>


        <div className="bg-white p-5 rounded-2xl col-span-12 md:col-span-7 lg:col-span-8 md:row-span-8 flex flex-col">
          <h1 className="font-bold mb-2 text-lg">İŞLEMLER</h1>
          <div className="h-full">
            <div className="grid grid-cols-4 font-bold border-b pb-2">
              <h2>Ürün</h2>
              <h2>Adet</h2>
              <h2>İşlem</h2>
              <h2>Zaman</h2>
            </div>
            <div className="h-full">
              {inventoryData.length > 0 ? (
                inventoryData.map((product) => (
                  <div className="grid grid-cols-4 py-2 border-b">
                    <h3>{product.productname}</h3>
                    <h3>{product.productcount}</h3>
                    <h3>{product.aksiyon}</h3>
                    <h3>
                      {new Date(product.created_time).toLocaleString("tr-TR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </h3>
                  </div>
                ))
              ) : (
                <div className="w-full text-center font-bold text-gray-500 flex items-center justify-center">
                  Ürün bulunamadı
                </div>
              )}
            </div>
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
          <div
            className="bg-white p-10 rounded-lg flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
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
