import React, { useState } from 'react';
import { UserAuth } from '../context/SupabaseContext';
import { useNavigate } from 'react-router-dom';
/* Images */
/* Icons */
import { AiOutlineReload, AiOutlineDelete, AiOutlineCloudUpload } from "react-icons/ai";
import { IoChevronBackOutline } from "react-icons/io5";

export default function Profile() {
    const { session, user, signOut, uploadImage, fetchImages } = UserAuth();
    const navigate = useNavigate();
    const [userImages, setUserImages] = useState([]);
    const [deleteMode, setDeleteMode] = useState(false);

    // Bir Önceki Sayfaya Yönlendir
    const handleBack = async (e) => {
        e.preventDefault();
        try {
            navigate(-1);
        } catch (err) {
            alert("Beklenmedik Bir Hata Oluştu!"); // Alert ile hatayı bildir
        }
    };

    // Kullanıcının baş harflerini al
    const getInitials = (fullName) => {
        if (!fullName) return "";
        const nameParts = fullName.split(" ");
        const firstInitial = nameParts[0]?.charAt(0).toUpperCase();
        const secondInitial = nameParts[1]?.charAt(0).toUpperCase() || "";
        return `${firstInitial}${secondInitial}`;
    };

    // Hesap oluşturulma tarihinden geçen gün sayısını hesapla
    const calculateDaysPassed = (createdAt) => {
        if (!createdAt) return "Bilinmiyor";

        const createdDate = new Date(createdAt);
        const today = new Date();
        const diffTime = Math.abs(today - createdDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Gün farkı
        return `${diffDays}`;
    };

    // Resim yükleme işlemi
    const handleFileUpload = async (e) => {
        const file = e.target.files[0]; // Dosya seçimi
        if (!file) {
            alert("Lütfen bir resim seçin.");
            return;
        }

        try {
            // Resmi yükle
            const result = await uploadImage(session?.user?.id, file);

            // İşlem sonucu kullanıcıya bildirilir
            alert("Resim başarıyla yüklendi!");
            console.log("Yükleme sonucu:", result);
        } catch (err) {
            console.error("Resim yükleme hatası:", err.message);
            alert("Resim yüklenirken bir hata oluştu.");
        }
    };

    // Resimleri al
    const handleFetchImages = async () => {
        const images = await fetchImages(session?.user?.id);
        setUserImages(images);
    };
      
    return (
        <div className="w-full h-full bg-[#09090b] text-white flex flex-col">
            {/* Header */}
            <div className="w-full h-[80px] px-5 flex items-center justify-between border-b border-[#ffffff2c]">
                <img src={""} alt="Logo" className="w-20 h-20" />
                <div>
                    <IoChevronBackOutline
                        onClick={handleBack} // Çıkış yap
                        cursor="pointer"
                        size={35}
                        className="text-[#444343] hover:text-white transition-all duration-300"
                    />
                </div>
            </div>
            {/* Body */}
            <div className="grid p-5 gap-5 grid-cols-12 grid-rows-12">
                {/* Profil Kartı */}
                <div className="bg-[#18181b] w-full rounded-2xl shadow-lg p-8 col-span-12 row-span-4 md:col-span-4 md:row-span-4">
                    {/* Profil Resmi ve İsim */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-[#444343] text-white flex items-center justify-center rounded-full text-2xl font-bold">
                            {getInitials(user?.name || "Kullanıcı")}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{user?.name || "Kullanıcı"}</h1>
                            <p className="text-white/50 text-sm">{session?.user?.email || "E-posta mevcut değil"}</p>
                        </div>
                    </div>
                    {/* Profil Bilgileri */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-[#ffffff2c] pb-4">
                            <span className="text-white/50">Ünvan</span>
                            <span className="font-semibold">{user?.title || "Ünvan Yok"}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-[#ffffff2c] pb-4">
                            <span className="text-white/50">Hesap Durumu</span>
                            <span className="font-semibold">{calculateDaysPassed(session?.user?.created_at)} Gün</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-[#ffffff2c] pb-4">
                            <span className="text-white/50">Mağaza</span>
                            <span className="font-semibold">{user.branch_name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-white/50">Rozetler</span>
                            <span className="font-semibold">
                                <span className="text-orange-300">V60</span>,
                                <span className="text-red-300">Latte Art</span>,
                                <span className="text-green-300">Kalibrasyon</span>
                            </span>
                        </div>
                    </div>
                </div>
                {/* Kullanıcı Bilgileri */}
                <div className='col-span-12 row-span-4 md:col-span-8 md:row-span-4 bg-[#18181b] w-full rounded-2xl shadow-lg p-8'>
                    <h1 className='text-white text-2xl font-bold'>İşlemler</h1>
                </div>
                {/* Kullanıcı Resimleri */}
                <div className='col-span-12 row-span-12 bg-[#18181b] w-full rounded-2xl shadow-lg p-8'>
                    <div className='flex items-center justify-between mb-6'>
                        <h1 className='text-white text-2xl font-bold'>Resimler</h1>
                        <div className='flex items-center'>
                            {/* Upload Icon */}
                            <div
                                onClick={() => document.getElementById("fileInput").click()}
                                className="p-2 hover:text-white border-r-0 hover:bg-[#222224] rounded-tl-lg rounded-bl-lg text-[#444343] transition-all cursor-pointer border border-[#444343]"
                            >
                                <AiOutlineCloudUpload size={25} />
                            </div>
                            <input
                                type="file"
                                id="fileInput"
                                onChange={handleFileUpload}
                                className="hidden"
                            />

                            {/* Delete Icon */}
                            <div
                                onClick={() => setDeleteMode(!deleteMode)}
                                className={`p-2 text-[#444343] border border-[#444343] hover:bg-[#222224] border-r-0 hover:text-white transition-all cursor-pointer ${deleteMode ? "ring-2 ring-red-500" : ""}`}
                            >
                                <AiOutlineDelete size={25} />
                            </div>

                            {/* Reload Icon */}
                            <div
                                onClick={handleFetchImages}
                                className="p-2 rounded-tr-lg rounded-br-lg border border-[#444343] hover:bg-[#222224] hover:text-white text-[#444343] transition-all cursor-pointer"
                            >
                                <AiOutlineReload size={25} />
                            </div>
                        </div>
                    </div>
                    {/* Images */}
                    <div className='grid grid-cols-4 gap-4'>
                        {userImages.map((image, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={image}
                                    alt="Resim"
                                    className="w-[200px] h-[200px] object-cover rounded-[15px]"
                                />
                                {deleteMode && (
                                    <button
                                        className="w-[200px] absolute top-0 left-0 h-full bg-red-500/80 text-white flex items-center justify-center opacity-50 transition-opacity rounded-[15px]"
                                    >
                                        <AiOutlineDelete size={30} className="animate-pulse" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
