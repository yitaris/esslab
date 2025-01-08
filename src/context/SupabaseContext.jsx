import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export const USERS_TABLE = "users";
export const INVENTORY_TABLE = "envanter";

const SupabaseContext = createContext({});

export function useSupabase() {
  return useContext(SupabaseContext);
}

export const SupabaseProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tüm Envanteri Çek
  const fetchFullInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(INVENTORY_TABLE)
      .select("*")

    if (error) {
      console.error("Full Envanter çekme hatası:", error.message);
    } else {
      setData(data);
    }
    setLoading(false);
  };

  // Veri çekme fonksiyonu
  const fetchInventory = async (category) => {
    setLoading(true);
    const { data, error } = await supabase
      .from(INVENTORY_TABLE)
      .select("*")
      .eq("category", category);

    if (error) {
      console.error("Envanter çekme hatası:", error.message);
    } else {
      setData(data);
    }
    setLoading(false);
  };

  // Envanter güncelleme fonksiyonu
  const updateInventory = async (id, updates) => {
    setLoading(true);
    const { data, error } = await supabase
      .from(INVENTORY_TABLE)
      .update(updates)
      .eq("id", id);

    if (error) {
      console.error("Envanter güncelleme hatası:", error.message);
    } else {
      console.log("Envanter güncellendi:", data);
    }
    setLoading(false);
  };

  // Add Inventory
  const addInventory = async (newItem) => {
    setLoading(true);
    const { data, error } = await supabase
      .from(INVENTORY_TABLE)
      .insert([{ ...newItem, zaman: new Date() }]);

    if (error) {
      console.error("Envanter ekleme hatası:", error.message);
      alert(`Hata: ${error.message}`);
    } else {
      console.log("Yeni envanter eklendi:", data);
      await fetchFullInventory(); // Envanteri yeniden yükle
    }
    setLoading(false);
  };
  // Veri Kaydetme Fonksiyonu
  const saveExcelDatabase = async (data) => {
    try {
      const { error } = await supabase
        .from('raporlar')
        .insert(data);

      if (error) throw error;
      console.log('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error.message);
    }
  };

  // Veri Getirme Fonksiyonu
  const fetchExcelDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('raporlar')
        .select('*');

      if (error) throw error;
      setSavedReports(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const value = {
    data,
    loading,
    fetchFullInventory,
    fetchInventory,
    updateInventory,
    addInventory,
    saveExcelDatabase,
    fetchExcelDatabase,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};
