import { createContext, useContext, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export const USERS_TABLE = "users";
export const INVENTORY_TABLE = "envanter";
export const RAPOR = "raporlar";
export const PRODUCT = "product";

const SupabaseContext = createContext({});

export function useSupabase() {
  return useContext(SupabaseContext);
}

export const SupabaseProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const { publicUrlExcel, setPublicUrlExcel } = useState("")
  const [excelDataPublic, setExcelDataPublic] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tüm Envanteri Çek
  const fetchFullInventory = async () => {
    setLoading(true);
    try{
      const { data: inventoryData, error:inventoryError } = await supabase
      .from(INVENTORY_TABLE)
      .select("*")

      if(inventoryError){
        alert(`hata: ${productError.message}`);
      } else {
        setInventoryData(inventoryData);
      }
    }catch (e) {
      console.log("inventory ERROR:",e);
    } finally {
      setLoading(false);
    }
  };

  // Veri çekme fonksiyonu
  const deleteInventory = async (id) => {
    setLoading(true);
    try {
    const { data: inventoryData, error:inventoryError } = await supabase
      .from(INVENTORY_TABLE)
      .delete("*")
      .eq("id",id)

    if (inventoryError) {
      console.error("Envanter çekme hatası:", inventoryError.message);
    } else {
      setInventoryData(inventoryData);
    }
  } catch (e) {
    console.log("inventory ERROR:",e);
  } finally {
    setLoading(false);
  }
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

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data: productData, error: productError } = await supabase
        .from(PRODUCT)
        .select("*");

        if(productError){
          alert(`hata: ${productError.message}`);
        } else {
          setData(productData);
        }
    }
    catch (e) {
      alert(`hata: ${e.message}`);
    }
    finally {
      setLoading(false);
    }
  }

  const addProductToInventory = async (product) => {
    setLoading(true);
    try{
      const { data, error } = await supabase
      .from(INVENTORY_TABLE)
      .insert([
        {
          productname: product.name,
          image_url: product.image_url,
          productcount: product.quantity,
          aksiyon: product.action,
          zaman: product.expiryDate,
        }
      ]);
      if (error) {
        console.error('Ürün kaydedilemedi:', error.message);
      } else {
        console.log('Ürün başarıyla kaydedildi:', data);
      }
    } catch (err) {
      console.error('Hata:', err);
    } finally {
      setLoading(false);
    }
  }


  // Veri Getirme Fonksiyonu
  const fetchExcelDatabase = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(RAPOR)
      .select("*")

    if (error) {
      console.error("Raporlar tablosundan veri çekilirken hata:", error.message);
    } else {
      console.log("Çekilen raporlar:", data);
      setExcelDataPublic(data); // Verileri state'e ata
    }
    setLoading(false);
  };

  const saveAndStoreExcelReport = async (filename, bufferExcel) => {
    setLoading(true);

    try {
      // Excel dosyasını Supabase Storage'a yükle
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from(RAPOR)
        .upload(`raporlar/${filename}`, bufferExcel, {
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

      if (uploadError) {
        throw new Error(`Rapor yükleme hatası: ${uploadError.message}`);
      }

      console.log("Excel dosyası başarıyla yüklendi:", uploadData);

      // Yüklenen dosya için public URL al
      const { data: publicUrlData, error: publicUrlError } = await supabase
        .storage
        .from(RAPOR)
        .getPublicUrl(`raporlar/${filename}`);

      if (publicUrlError) {
        throw new Error(`Public URL alma hatası: ${publicUrlError.message}`);
      }

      const publicUrl = publicUrlData.publicUrl;
      console.log("Public URL alındı:", publicUrl);

      // Public URL'i veritabanına kaydet
      const { data: insertData, error: insertError } = await supabase
        .from(RAPOR)
        .insert([
          {
            name: filename,
            dosya_url: publicUrl,
          },
        ]);

      if (insertError) {
        throw new Error(`Veritabanına kayıt hatası: ${insertError.message}`);
      }

      console.log("Public URL ve dosya adı veritabanına kaydedildi:", insertData);

      // Gerekirse güncellemeleri veya diğer işlemleri tetikleyin
      await fetchExcelDatabase();
    } catch (error) {
      console.error(error.message);
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (filePath, file, fileName) => {
    setLoading(true);
    try {
      const sanitizedFilePath = filePath.replace(/[^a-zA-Z0-9/_-]/g, '_');
      const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9/_-]/g, '_');

      const { data: handleData, error: handleError } = await supabase
        .storage
        .from(RAPOR)
        .upload(sanitizedFilePath, file);

      if (handleError) {
        console.error('Upload error from Supabase:', handleError.message);
      } else {
        console.log('Upload successful:', handleData);
      }

      const { data: publicUrlData, error: publicUrlError } = await supabase
        .storage
        .from(RAPOR)
        .getPublicUrl(filePath);

      if (publicUrlError) {
        throw new Error(`Public URL alma hatası: ${publicUrlError.message}`);
      }

      const publicUrl = publicUrlData.publicUrl;
      console.log("Public URL alındı:", publicUrl);

      const { data: insertData, error: insertError } = await supabase
        .from(RAPOR)
        .insert([
          {
            name: sanitizedFileName,
            dosya_url: publicUrl,
          }
        ])

      if (insertError) {
        throw new Error(`Veritabanına kayıt hatası: ${insertError.message}`);
      }

      console.log("Public URL ve dosya adı veritabanına kaydedildi:", insertData);

    } catch (error) {
      console.error('Unexpected error during upload:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (filePath) => {
    try {
      const { data: downloadFileData, error: downloadFileError } = await supabase
        .storage
        .from(RAPOR)
        .download(filePath);

      if (downloadFileError) {
        console.error('Upload error from Supabase:', downloadFileError.message);
      } else {
        console.log('Upload successful:', downloadFileData);
      }

      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filePath.split('/').pop()); // Dosya adı
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error(error.message);
      alert(`Hata: ${error.message}`);
    }
  };


  const value = {
    data,
    inventoryData,
    excelDataPublic,
    loading,
    publicUrlExcel,
    fetchFullInventory,
    deleteInventory,
    fetchProduct,
    updateInventory,
    addInventory,
    fetchExcelDatabase,
    saveAndStoreExcelReport,
    handleDrop,
    downloadFile,
    addProductToInventory,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};
