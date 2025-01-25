import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [user, setUser] = useState([]);
  // Sign in
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      // Handle Supabase error explicitly
      if (error) {
        console.error("Sign-in error:", error.message); // Log the error for debugging
        return { success: false, error: error.message }; // Return the error
      }

      // Kullanıcı oturum açtı, user bilgilerini getir
      await fetchUserDetails(data.user.id);

      return { success: true, data }; // Return the user data
    } catch (error) {
      // Handle unexpected issues
      console.error("Unexpected error during sign-in:", err.message);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  // Kullanıcı bilgilerini Supabase'den al ve state'e kaydet
  const fetchUserDetails = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("users") // `users` tablosu
        .select("branch_id, name, title, branch_name") // İlgili sütunları seçiyoruz
        .eq("id", userId) // Kullanıcının id'siyle eşleştir
        .single(); // Tek bir kayıt dönecek

      if (error) {
        console.error("Error fetching user details:", error.message);
        return;
      }
      // Kullanıcı bilgilerini state'e kaydet
      setUser(data);
      console.log("User details fetched:", data);
    } catch (error) {
      console.error("Unexpected error while fetching user details:", error.message);
    }
  };
  // Resim Ekle
  const uploadImage = async (userId, image) => {
    try {
      // 1. Resmi Supabase Storage'a yükle
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images") // Bucket adı "images"
        .upload(`${userId}/${image.name}`, image);

      if (uploadError) {
        console.error("Resim yükleme hatası:", uploadError.message);
        alert("Resim yüklenirken bir hata oluştu.");
        return;
      }

      // 2. Public URL oluştur
      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("images")
        .getPublicUrl(uploadData.path);

      if (publicUrlError || !publicUrlData.publicUrl) {
        console.error("Public URL oluşturulamadı:", publicUrlError?.message);
        alert("Public URL oluşturulamadı.");
        return;
      }

      const publicUrl = publicUrlData.publicUrl;

      // 3. Mevcut resim URL'lerini veritabanından al
      const { data: existingImages, error: fetchError } = await supabase
        .from("images")
        .select("image_url")
        .eq("id", userId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // Kod: "PGRST116", satırın bulunamadığını gösterir
        console.error("Mevcut resimler alınırken hata oluştu:", fetchError.message);
        return;
      }

      // 4. Yeni resim URL'sini mevcut URL'lere ekle
      const updatedUrls = existingImages?.image_url
        ? [...existingImages.image_url, publicUrl]
        : [publicUrl]; // Yeni bir JSON array oluştur

      // 5. Veritabanına kaydet veya güncelle
      const { error: dbError } = await supabase
        .from("images")
        .upsert([
          {
            id: userId, // Kullanıcı ID'si
            image_url: updatedUrls, // Güncellenmiş URL'ler
          },
        ]);

      if (dbError) {
        console.error("Veritabanına kaydetme hatası:", dbError.message);
        alert("Veritabanına kaydedilirken bir hata oluştu.");
        return;
      }

      alert("Resim başarıyla yüklendi ve kaydedildi.");
    } catch (error) {
      console.error("Beklenmedik hata oluştu:", error.message);
      alert("Resim yüklenirken bir hata oluştu.");
    }
  };

  // Resimleri al
  const fetchImages = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("images")
        .select("image_url")
        .eq("id", userId)
        .single(); // Tek bir kullanıcı kaydını al

      if (error) {
        console.error("Resimler alınırken hata oluştu:", error.message);
        return [];
      }

      return data?.image_url || []; // URLs array'ini döndür
    } catch (error) {
      console.error("Beklenmedik hata oluştu:", error.message);
      return [];
    }
  };

  // product tablosundaki tüm verileri al
  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "İçecekler");

      if (error) {
        console.error("Error fetching products details:", error.message);
        return [];
      }
      return data;
    }
    catch (error) {
      console.error("Unexpected error while fetching products details:", error.message);
    }
  }

  // Add new function to update break status
  const updateBreakStatus = async (userId, isOnBreak) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ mola: isOnBreak })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Mola durumu güncellenemedi:", error.message);
      return false;
    }
  };

  const fetchBranchUsers = async (branchId) => {
    try {
      const { data, error } = await supabase
        .from("users") // users tablosu
        .select("id, name, mola, vardiya, temizlik") // Sadece id ve name sütunlarını al
        .eq("branch_id", branchId); // branch_id eşleşen kullanıcılar
  
      if (error) {
        console.error("Error fetching branch users:", error.message);
        return [];
      }
      return data;
    } catch (error) {
      console.error("Unexpected error while fetching branch users:", error.message);
      return [];
    }
  };

  const updateUserShiftAndCleaning = async (userId, vardiya, temizlik) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          vardiya: vardiya,
          temizlik: temizlik 
        })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Vardiya ve temizlik güncellenemedi:", error.message);
      return false;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Sign out
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signInUser,
        session,
        user,
        signOut,
        fetchUserDetails,
        fetchProduct,
        uploadImage,
        fetchImages,
        updateBreakStatus,
        fetchBranchUsers,
        updateUserShiftAndCleaning,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};