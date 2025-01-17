import React, { useState, useEffect } from "react";
import { useSupabase } from "../context/SupabaseContext";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import { FaBorderAll } from "react-icons/fa";
import { PiHamburgerFill } from "react-icons/pi";
import { RiDrinksLine, RiCake3Fill, } from "react-icons/ri";
import { TbArrowBarRight, TbCalendar } from "react-icons/tb";
import { FaBottleDroplet } from "react-icons/fa6";

import {
  addProduct,
  handleRemoveProduct,
  handleQuantityChange,
  handleActionChange,
  handleDateChange,
} from "../helpers/productUtils";
import DateTimeDisplay from "../helpers/dateTimeDisplay";

const categoryIcons = [
  { Component: FaBorderAll, color: "black" },
  { Component: PiHamburgerFill, color: "orange" },
  { Component: RiCake3Fill, color: "purple" },
  { Component: RiDrinksLine, color: "#789DBC" },
  { Component: FaBottleDroplet, color: "#72BF78" },
];

export default function Fetchadd() {
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredProductList, setFilteredProductList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [searchQuery, setSearchQuery] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState(""); // Eklenmiş ürün listesi arama
  const { data, fetchProduct, addProductToInventory } = useSupabase();
  const [openProductList, setOpenProductList] = useState(false);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    fetchProduct();
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
    setFilteredProductList(
      productList.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, productList, data]);

  useEffect(() => {
    setFilteredProductList(
      productList.filter((product) =>
        product.name.toLowerCase().includes(productSearchQuery.toLowerCase())
      )
    );
  }, [productSearchQuery, productList]);

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
  const renderCategoryIcon = (index, isSelected) => {
    const { Component, color } = categoryIcons[index] || {};
    return Component ? <Component fill={isSelected ? color : "gray"} size={30} /> : null;
  };
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
    } finally {
      setProductList([])
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
                <div className="flex items-center justify-center relative">
                  <TbArrowBarRight
                    size={30}
                    onClick={handleCloseProductList}
                    className="absolute left-0 cursor-pointer text-gray-700 hover:text-gray-900 transition"
                  />
                  <div className="bg-gray-100 rounded-full flex items-center p-2">
                    <IoSearch size={20} className="text-gray-600" />
                    <input
                      type="text"
                      placeholder="Ürün ara..."
                      className="bg-transparent focus:outline-none px-2 py-1 w-full text-sm"
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-y-scroll">
                  {filteredProductList.map((product) => (
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
                              onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10), setProductList)}
                            />
                          </div>
                          <div>
                            <label htmlFor={`action-${product.id}`} className="block text-sm font-semibold text-gray-600">İşlem</label>
                            <select
                              id={`action-${product.id}`}
                              name={`action-${product.id}`}
                              className="w-full p-2 border border-gray-300 rounded-md mt-1 bg-white"
                              onChange={(e) => handleActionChange(product.id, e.target.value, setProductList)}
                            >
                              <option value="İşlem">İşlem</option>
                              <option value="Gelen">Gelen</option>
                              <option value="Kapanis">Kapanış</option>
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
                                onChange={(e) => handleDateChange(product.id, e.target.value, setProductList)}
                                className="w-full p-2 border border-gray-300 rounded-md mt-1 absolute top-0 left-0 opacity-0 cursor-pointer"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveProduct(product.id, setProductList)}
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
                    İşlemi Onayla
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tarih ve Saat */}
        <DateTimeDisplay setOpenProductList={handleProductList} />

        {/* Kategori Kutuları */}
        <motion.div
          variants={fadeInVariant}
          transition={{ delay: 0.2 }}
          className="flex gap-5 p-2 w-full overflow-x-scroll scrollbar-hide"
        >
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => setSelectedCategory(category.name)}
              className={`bg-white min-w-[130px] h-[130px] rounded-lg lg:rounded-2xl flex flex-col justify-between p-3 shadow-md cursor-pointer ${selectedCategory === category.name ? "ring-2 ring-gray-500" : ""
                }`}
            >
              {renderCategoryIcon(index, selectedCategory === category.name)}
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
                  className="text-lg text-gray-400 hover:text-white hover:bg-green-400 transition-all duration-800 ease-in-out mr-2 w-[35px] h-full rounded-xl bg-green-200 shado"
                  onClick={() => addProduct({ id: item.id, name: item.name, image: item.image_url, category: item.category }, setProductList, setOpenProductList)}>
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
