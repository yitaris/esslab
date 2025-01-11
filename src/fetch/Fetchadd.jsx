import React, { useState, useEffect } from "react";
import { useSupabase } from "../context/SupabaseContext";
import { ubgida } from "../assets";
import { motion, AnimatePresence } from "framer-motion";
import { IoTime, IoSearch } from "react-icons/io5";
import { FaCalendarAlt, FaBorderAll } from "react-icons/fa";
import { PiHamburgerFill } from "react-icons/pi";
import { LuCakeSlice } from "react-icons/lu";
import { RiDrinksLine } from "react-icons/ri";
import { TbArrowBarLeft, TbArrowBarRight } from "react-icons/tb";

export default function Fetchadd() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [showContent, setShowContent] = useState(false);
  const { data, loading, fetchProduct } = useSupabase();
  const [openProductList, setOpenProductList] = useState(false);
  const [productList, setProductList] = useState([]);

  const addProduct = (product) => {
    setProductList([...productList, product]);
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
    setOpenProductList((prev) => !prev);
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
              className={`bg-white absolute h-full right-0 rounded-2xl`}
              initial={{ width: '50px' }}
              animate={{ width: '300px' }}
              exit={{ width: '50px' }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full h-full p-5">
                <TbArrowBarRight size={25} onClick={handleProductList} className="cursor-pointer" />
                <div className="mt-5">
                  {productList.map((product, index) => (
                    <div key={index} className="flex items-center mb-4">
                      <img src={product.image} alt={product.name} className="w-20 h-20 mr-4 rounded-2xl" />
                      <div>
                        <h4 className="text-lg font-semibold">{product.name}</h4>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                    </div>
                  ))}
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
                <span className={`${item.category === "Sandviç" ? "text-orange-500" : item.category === "Tatlı" ? "text-[#800080]" : item.category === "İçecekler" ? "text-[#789dbc]" : ""} text-xs lg:text-sm font-semibold`}>
                  {item.category}
                </span>
                <button 
                 className="text-lg mr-2"
                 onClick={() => addProduct({ name:item.name, image:item.image_url, category:item.category})}>
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
