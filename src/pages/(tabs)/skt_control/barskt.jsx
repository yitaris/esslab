import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/SupabaseContext";
import dayjs from "dayjs";
import { Card, CardContent } from "../../../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../../components/ui/input-otp";

export default function BarSkt() {
  const { getSKT, deleteSKT, user } = useAuth();
  const [skt, setSkt] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSKT = async () => {
      try {
        if (user?.branch_id) {
          const data = await getSKT(user.branch_id);
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

  const handleDelete = async () => {
    if (otp === "1373") {
      try {
        await deleteSKT(selectedItem.id);
        setSkt((prev) => prev.filter((item) => item.id !== selectedItem.id));
        setIsModalOpen(false);
        setOtp("");
        setError("");
      } catch (error) {
        console.error("Error deleting SKT:", error);
      }
    } else {
      setError("Şifreniz yanlış"); 
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (skt.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 p-10">
      <header>
        <h1 className="text-2xl font-bold">BAR SKT KONTROL</h1>
      </header>
      <Carousel opts={{ align: "start" }} className="w-full max-w-sm">
        <CarouselContent>
          {skt.map((item, key) => {
            const today = dayjs();
            const expiryDate = today.add(item.skt_at, "day");
            const formattedDate = expiryDate.format("DD.MM.YYYY");

            return (
              <CarouselItem key={key} className="w-full">
                <div className="p-1 relative">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-1/2 h-[150px] object-cover rounded-lg"
                      />
                      <span className="text-md font-semibold mt-2">{item.name}</span>
                      <span className="text-red-500 text-sm mt-2">
                        Bu ürün {formattedDate} tarihinde atılmalıdır.
                      </span>
                    </CardContent>
                  </Card>
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsModalOpen(true);
                      setOtp("");
                      setError("");
                    }}
                    className="absolute top-0 right-0 bg-red-600 text-white w-7 h-7 rounded-md text-center font-bold hover:bg-red-700 transition"
                  >
                    -
                  </button>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* OTP Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-64 h-64 flex flex-col justify-center items-center">
          <DialogHeader>
            <DialogTitle>Silme Onayı</DialogTitle>
          </DialogHeader>
          <InputOTP
            maxLength={4}
            value={otp}
            onChange={setOtp}
            className="text-center"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <Button onClick={handleDelete} variant="destructive" className="mt-4 w-[50%]">
            Sil
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
