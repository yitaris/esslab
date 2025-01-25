import React from "react";
import { UserAuth } from "../context/SupabaseContext";

/* Pages */
import AdminPage from "../admin/AdminPage";
import UserPage from "../user/UserPage";

export default function Dashboard() {
  const { user, session } = UserAuth();

  // Eğer kullanıcı verisi yüklenmemişse yükleniyor göstergesi
  if (!session || !user) {
    return <div>Yükleniyor...</div>;
  }

  // Admin ise AdminPage, aksi halde UserPage göster
  return (
    <div className="">
      {user.title === "müdür" ? (
        <AdminPage />
      ) : (
        <UserPage />
      )}
    </div>
  );
}
