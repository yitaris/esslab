import React, { useState, useEffect } from "react";
import { useSupabase } from "../context/SupabaseContext";
import { ubgida } from "../assets";
import { motion, AnimatePresence } from "framer-motion";
import { IoTime, IoSearch } from "react-icons/io5";
import { FaCalendarAlt, FaBorderAll } from "react-icons/fa";
import { PiHamburgerFill } from "react-icons/pi";
import { LuCakeSlice } from "react-icons/lu";
import { RiDrinksLine } from "react-icons/ri";
import { TbArrowBarLeft, TbArrowBarRight, TbCalendar } from "react-icons/tb";
import { FaBottleDroplet } from "react-icons/fa6";

export default function Fetchadd() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [showContent, setShowContent] = useState(false);
  const { data, loading, fetchProduct, addProductToInventory } = useSupabase();
  const [openProductList, setOpenProductList] = useState(false);
  const [productList, setProductList] = useState([]);

  const addProduct = (product) => {
    console.log('addProduct çağrıldı:', product);
    setOpenProductList(true);
    setProductList((prevList) => {
      const existingProduct = prevList.find((p) => p.id === product.id);
      if (existingProduct) {
        return prevList.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prevList, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveProduct = (id) => {
    setProductList((prevList) => {
      const updatedList = prevList.map((product) =>
        product.id === id ? { ...product, quantity: product.quantity - 1 } : product
      ).filter((product) => product.quantity > 0);
      return updatedList;
    });
  };

  const handleQuantityChange = (id, newQuantity) => {
    setProductList((prevList) => {
      const updatedList = prevList.map((product) =>
        product.id === id ? { ...product, quantity: newQuantity } : product
      );
      return updatedList;
    });
  };

  const handleActionChange = (id, value) => {
    setProductList((prevList) =>
      prevList.map((product) =>
        product.id === id ? { ...product, action: value } : product
      )
    );
  };

  const handleDateChange = (id, value) => {
    setProductList((prevList) =>
      prevList.map((product) =>
        product.id === id ? { ...product, expiryDate: value } : product
      )
    );
  };

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3000);
    return () => clearTimeout(timer);
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

  if (loading || !showContent)
    return (
      <div className="absolute inset-0 grid place-content-center">
        <img
          src={ubgida}
          alt="Loading..."
          className="w-30 h-30 animate-pulse"
        />
      </div>
    );

  const fadeInVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const handleProductList = () => {
    setOpenProductList(true);
  };
  const handleCloseProductList = () => {
    setOpenProductList(false);
  }

  const handleComplete = async () => {
    try {
      for (const product of productList) {
        await addProductToInventory({
          name: product.name,
          image_url: product.image,
          quantity: product.quantity,
          action: product.action,
          expiryDate: product.expiryDate,
        });
      }
      alert('Ürünler kaydedildi!');
    } catch (err) {
      console.error('Ürünler kaydedilirken hata oluştu:', err);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 1 }}
      className="w-full h-full lg:p-10 relative"
    >

      <motion.div
        variants={fadeInVariant}
        className="bg-[#fbfbfbf5] relative w-full h-full rounded-lg lg:rounded-2xl p-5 grid gap-5 grid-rows-[auto,auto,auto,1fr]"
      >
        <AnimatePresence>
  {openProductList && (
    <motion.div
      className="bg-white absolute h-full right-0 rounded-2xl shadow-lg z-100"
      initial={{ width: '50px' }}
      animate={{ width: '400px' }}
      exit={{ width: '50px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full h-full p-5 flex flex-col gap-5">
        <TbArrowBarRight
          size={30}
          onClick={handleCloseProductList}
          className="cursor-pointer text-gray-700 hover:text-gray-900 transition"
        />
        <div className="overflow-y-scroll">
          {productList.map((product) => (
            <div key={product.id} className="grid grid-cols-1 sm:grid-cols-[1fr,2fr] gap-4 mb-4 bg-gray-100 p-4 rounded-lg shadow-sm">
              <div className="flex justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-[100px] h-[100px] object-cover rounded-lg"
                />
              </div>
              <div className="flex-grow relative">
                <h4 className="text-lg font-semibold text-gray-800">{product.name}</h4>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`quantity-${product.id}`} className="block text-sm font-semibold text-gray-600">Miktar</label>
                    <input
                      type="number"
                      id={`quantity-${product.id}`}
                      name={`quantity-${product.id}`}
                      className="w-full p-2 border border-gray-300 rounded-md mt-1"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10))}
                    />
                  </div>
                  <div>
                    <label htmlFor={`action-${product.id}`} className="block text-sm font-semibold text-gray-600">İşlem</label>
                    <select
                      id={`action-${product.id}`}
                      name={`action-${product.id}`}
                      className="w-full p-2 border border-gray-300 rounded-md mt-1 bg-white"
                      onChange={(e) => handleActionChange(product.id, e.target.value)}
                    >
                      <option value="Acildi">Açıldı</option>
                      <option value="Acilmadi">Açılmadı</option>
                      <option value="Atik">Atık</option>
                    </select>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center w-4/5">
                    <label className="block text-sm font-semibold text-gray-600 mr-2">SKT Tarihi</label>
                    <div className="relative">
                      <button
                        onClick={() => document.getElementById(`date-${product.id}`).click()}
                        className="p-2 rounded-lg bg-white hover:bg-gray-200 transition duration-500"
                      >
                        <TbCalendar size={20} className="text-gray-600" />
                      </button>
                      <input
                        type="date"
                        id={`date-${product.id}`}
                        name={`date-${product.id}`}
                        onChange={(e) => handleDateChange(product.id, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md mt-1 absolute top-0 left-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveProduct(product.id)}
                    className="absolute right-0 top-0 h-[25px] w-[25px] flex items-center justify-center bg-white text-red text-xl font-semibold hover:text-white p-2 rounded-md ml-2 hover:bg-red-600 transition duration-500"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button 
            onClick={handleComplete}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition font-bold">
            İşlemi Tamamla
          </button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>





        {/* Tarih ve Saat */}
        <motion.div
          variants={fadeInVariant}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-[250px,10px,1fr] gap-2 px-2"
        >
          <div className="bg-white flex items-center rounded-lg lg:rounded-2xl p-3 shadow-md">
            <div className="bg-[#3c3b3ba6] p-2 flex justify-center items-center rounded-full">
              <FaCalendarAlt fill="white" />
            </div>
            <span className="ml-3 text-gray-700 capitalize font-bold text-sm lg:text-base">
              {currentDate}
            </span>
          </div>
          <span className="hidden sm:flex items-center text-2xl">-</span>
          <div className="grid grid-cols-[150px,1fr] gap-2">
            <div className="bg-white flex items-center rounded-lg lg:rounded-2xl p-3 shadow-md">
              <div className="bg-[#3c3b3ba6] p-2 flex justify-center items-center rounded-full">
                <IoTime fill="white" />
              </div>
              <span className="ml-3 text-gray-700 font-bold text-sm lg:text-base">
                {currentTime}
              </span>
            </div>
            <div className="flex justify-end">
              <div onClick={handleProductList} className="bg-white p-5 rounded-2xl cursor-pointer hover:bg-gray-300 duration-500">
                <TbArrowBarLeft size={25} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Kategori Kutuları */}
        <motion.div
          variants={fadeInVariant}
          transition={{ delay: 0.2 }}
          className="flex space-x-4 p-2 w-full overflow-x-auto scrollbar-hide"
        >
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => setSelectedCategory(category.name)}
              className={`bg-white flex-shrink-0 w-[30vw] sm:w-[130px] h-[130px] rounded-lg lg:rounded-2xl flex flex-col justify-between p-3 shadow-md cursor-pointer ${selectedCategory === category.name ? "ring-2 ring-gray-500" : ""
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
              {index === 4 && (
                <FaBottleDroplet fill={`${selectedCategory === category.name ? "#72BF78" : "#A0D683"}`} size={30} />
              )}

              <span className="font-bold text-sm lg:text-base">{category.name}</span>
              <span className="text-xs lg:text-sm">{category.count} Ürün Var</span>
            </div>
          ))}
        </motion.div>

        {/* Arama Çubuğu */}
        <motion.div
          variants={fadeInVariant}
          transition={{ delay: 0.3 }}
          className="p-2"
        >
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
        </motion.div>

        {/* Ürün Listesi */}
        <motion.div
          variants={fadeInVariant}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-5 overflow-y-auto max-h-[600px] p-2"
        >
          {filteredProducts.map((item, index) => (
            <motion.div
              key={index}
              variants={fadeInVariant}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white w-full h-[260px] rounded-lg lg:rounded-2xl grid grid-rows-[4fr,2fr,1fr] p-2 shadow-md"
            >
              {/* Resim Bölgesi */}
              <div className="w-full h-full rounded-lg lg:rounded-2xl flex justify-center items-center overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className={`w-full h-full ${item.category === "Şurup" ? "object-contain" : "object-cover"} rounded-2xl`}
                />
              </div>

              {/* Ürün Adı */}
              <span className={`font-bold line-clamp-2 text-sm lg:text-base flex items-center`}>
                {item.name}
              </span>

              {/* Kategori ve Buton */}
              <div className="flex justify-between items-center">
                <span className={`${item.category === "Sandviç" ? "text-orange-500" : item.category === "Tatlı" ? "text-[#800080]" : item.category === "İçecekler" ? "text-[#789dbc]" : "text-[#72BF78]"} text-xs lg:text-sm font-semibold`}>
                  {item.category}
                </span>
                <button
                  className="text-lg mr-2"
                  onClick={() => addProduct({ id: item.id, name: item.name, image: item.image_url, category: item.category })}>
                  +
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
