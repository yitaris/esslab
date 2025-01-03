import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const USERS_TABLE = 'users';
export const INVENTORY_TABLE = 'envanter';

const SupabaseContext = createContext({});

export function useSupabase() {
  return useContext(SupabaseContext);
}

export const SupabaseProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Veri çekme fonksiyonu
  const fetchInventory = async (category) => {
    setLoading(true);
    const { data, error } = await supabase
      .from(INVENTORY_TABLE)
      .select('*')
      .eq('category', category);

    if (error) {
      console.error('Envanter çekme hatası:', error.message);
    } else {
      setData(data);
    }
    setLoading(false);
  };

  const value = {
    data,
    loading,
    fetchInventory,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};
