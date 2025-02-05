import React from "react";
import { UserAuth } from "../context/SupabaseContext";
import { Link } from "react-router-dom";
/* Pages */
import AdminPage from "../admin/AdminPage";

export default function Dashboard() {
  const { user, session } = UserAuth();

  // Eğer kullanıcı verisi yüklenmemişse yükleniyor göstergesi
  if (!session || !user) {
    return <div>Yükleniyor...</div>;
  }

  // Admin ise AdminPage, aksi halde UserPage göster
  return (
    <div className="">
      {user.title === "Mağaza Müdürü" ? (
        <AdminPage />
      ) : (
        <div className="flex flex-col justify-center items-center h-screen gap-2">
          <h1 className="text-2xl font-bold">Yetkiniz Bulunmamaktadır</h1>
          <Link to="/">
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md">
              Giriş Yap
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
