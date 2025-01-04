import React, { useState, useEffect } from "react";
import { useSupabase } from "../context/SupabaseContext";
import { esslabicon } from "../assets";

export default function Fetchpanel() {
  const { data, loading, fetchFullInventory, updateInventory } = useSupabase();
  const [editMode, setEditMode] = useState(null); // Tracks the item being edited
  const [editedValue, setEditedValue] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Tracks search input

  useEffect(() => {
    fetchFullInventory(); // Fetch all items
  }, []);

  const handleSave = async (id) => {
    await updateInventory(id, { productcount: editedValue });
    setEditMode(null);
    fetchFullInventory(); // Refresh inventory after update
  };

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    item.productname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Data with productcount < 5
  const lowStockData = filteredData.filter((item) => item.productcount < 5);

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
    <div className="w-full h-full px-10">
      <div className="bg-gray-50 rounded-2xl shadow-lg p-4 h-full">
        {/* Search Bar */}
        <div className="mb-4 mt-4 grid place-content-center">
          <input
            type="text"
            placeholder="Ürün adı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white w-[300px] px-4 py-2 border rounded-2xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Header for Low Stock */}
        {lowStockData.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-yellow-600 mb-2">Sipariş Verilmeli</h2>
            <div className="grid grid-cols-[2fr,2fr,2fr,1fr] text-lg font-semibold text-yellow-600 border-b pb-2 mb-2">
              <div>Ürün Kategorisi</div>
              <div>Ürün Adı</div>
              <div>Ürün Adeti</div>
              <div>Aksiyon</div>
            </div>
            {/* Scrollable container */}
            <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
              {lowStockData.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[2fr,2fr,2fr,1fr] items-center py-2 border-b last:border-b-0 text-sm bg-yellow-100"
                >
                  <div>{item.category}</div>
                  <div>{item.productname}</div>
                  <div>
                    {editMode === item.id ? (
                      <input
                        type="number"
                        value={editedValue}
                        onChange={(e) => setEditedValue(e.target.value)}
                        className="w-20 px-2 py-1 border rounded text-center bg-white"
                      />
                    ) : (
                      item.productcount
                    )}
                  </div>
                  <div>
                    {editMode === item.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(item.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Onayla
                        </button>
                        <button
                          onClick={() => setEditMode(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          İptal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditMode(item.id);
                          setEditedValue(item.productcount);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Düzenle
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}


        {/* Header for All Items */}
        <h2 className="text-lg font-bold text-green-500 mt-4">Tüm Envanter</h2>
        <div className="grid grid-cols-[2fr,2fr,2fr,1fr] text-lg font-semibold text-green-500 border-b pb-2 mb-2">
          <div>Ürün Kategorisi</div>
          <div>Ürün Adı</div>
          <div>Ürün Adeti</div>
          <div>Aksiyon</div>
        </div>

        {/* All Filtered Data */}
        <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[2fr,2fr,2fr,1fr] items-center py-2 border-b last:border-b-0 text-sm"
            >
              <div>{item.category}</div>
              <div>{item.productname}</div>
              <div>
                {editMode === item.id ? (
                  <input
                    type="number"
                    value={editedValue}
                    onChange={(e) => setEditedValue(e.target.value)}
                    className="w-20 px-2 py-1 border rounded text-center bg-white"
                  />
                ) : (
                  item.productcount
                )}
              </div>
              <div>
                {editMode === item.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(item.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Onayla
                    </button>
                    <button
                      onClick={() => setEditMode(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded"
                    >
                      İptal
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditMode(item.id);
                      setEditedValue(item.productcount);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Düzenle
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
