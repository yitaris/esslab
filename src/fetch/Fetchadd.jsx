import React, { useState } from "react";
import { useSupabase } from "../context/SupabaseContext";
import { esslabicon } from "../assets";

export default function Fetchadd() {
  const { data, loading, addInventory } = useSupabase();
  const [newItem, setNewItem] = useState({
    category: "",
    productname: "",
    productcount: "",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = ["paket", "bardak", "surup", "sut", "sandivic", "pasta"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (category) => {
    setNewItem((prev) => ({ ...prev, category }));
    setIsDropdownOpen(false); // Menü kapatılır
  };

  const handleAddItem = async () => {
    if (!newItem.category || !newItem.productname || !newItem.productcount) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }
    await addInventory({ ...newItem, zaman: new Date() });
    setNewItem({ category: "", productname: "", productcount: "" }); // Formu temizle
  };

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
    <div className="h-full px-10">
      <div className="bg-gray-50 rounded-2xl shadow-lg p-4 h-full">
        <h1 className="text-2xl font-semibold mb-4">Yeni Ürün Ekle</h1>
        <div className="grid gap-4 mb-6">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="bg-white px-4 py-2 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-[200px] text-left"
            >
              {newItem.category || "Kategori Seçin"}
              <span className="float-right">▼</span>
            </button>
            <div
              className={`absolute z-10 bg-white border rounded-xl shadow-md mt-2 w-[200px] transition-all duration-300 overflow-hidden ${
                isDropdownOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {categories.map((category) => (
                <div
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-sm"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
          <input
            type="text"
            name="productname"
            value={newItem.productname}
            onChange={handleInputChange}
            placeholder="Ürün Adı"
            className="bg-white w-[200px] px-4 py-2 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            name="productcount"
            value={newItem.productcount}
            onChange={handleInputChange}
            placeholder="Ürün Adeti"
            className="bg-white w-[200px] px-4 py-2 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          onClick={handleAddItem}
          className="bg-green-500 text-white px-4 py-2 rounded-xl shadow hover:bg-green-600"
        >
          Ekle
        </button>
      </div>
    </div>
  );
}
