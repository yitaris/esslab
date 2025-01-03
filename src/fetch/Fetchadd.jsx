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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
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
        <h1 className="text-2xl font-bold mb-4">Yeni Envanter Ekle</h1>
        <div className="grid gap-4 mb-6">
          <input
            type="text"
            name="category"
            value={newItem.category}
            onChange={handleInputChange}
            placeholder="Kategori"
            className="bg-white px-4 py-2 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            name="productname"
            value={newItem.productname}
            onChange={handleInputChange}
            placeholder="Ürün Adı"
            className="bg-white px-4 py-2 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            name="productcount"
            value={newItem.productcount}
            onChange={handleInputChange}
            placeholder="Ürün Adeti"
            className="bg-white px-4 py-2 border rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
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
