import React, { useEffect, useState } from "react";
import { UserAuth } from "../../context/SupabaseContext";
import dayjs from "dayjs";

export default function AdminAttendance() {
  const { getSKT, user } = UserAuth();
  const [skt, setSkt] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSKT = async () => {
      try {
        if (user?.branch_id) {
          const data = await getSKT(user.branch_id); // SKT verisini çek
          setSkt(data || []);
        }
      } catch (error) {
        console.error("Error fetching SKT:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSKT();
  }, [user?.branch_id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {skt.length > 0 ? (
        skt.map((item) => {
          const today = dayjs();
          const expiryDate = today.add(item.skt_at, "day"); // skt_at gün ekleyerek hesapla
          const daysLeft = expiryDate.diff(today, "day");

          return (
            <div
              key={item.id}
              className="w-full max-w-2xl border rounded-lg shadow-md bg-white overflow-hidden"
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-[500px] object-cover p-2"
              />
              <div className="p-4 text-center">
                <h2 className="text-2xl font-semibold">{item.name}</h2>
                <p className="text-gray-600 text-lg">
                  SKT Tarihi:{" "}
                  <span className="font-bold">
                    {expiryDate.format("DD/MM/YYYY")}
                  </span>
                </p>

                {daysLeft > 0 ? (
                  <p className="text-green-600 font-bold text-xl">
                    Ürün <span className="text-black">{daysLeft}</span> gün sonra atılmalıdır.
                  </p>
                ) : (
                  <p className="text-red-600 font-bold text-xl">
                    ⚠️ Ürünün süresi doldu!
                  </p>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-xl">No SKT records found.</p>
      )}
    </div>
  );
}
