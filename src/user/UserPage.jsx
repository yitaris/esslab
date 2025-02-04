import React, { useState, useEffect } from 'react';
import { UserAuth } from '../context/SupabaseContext';
import { useNavigate } from 'react-router-dom';
/* Images */
/* Icons */
import { AiOutlineUser, AiOutlineReload, AiOutlineSearch, AiOutlineClockCircle } from "react-icons/ai";
import { FiPlus, FiCoffee, FiClipboard, FiBox, FiBook, FiCheckSquare } from "react-icons/fi";

// Bileşenleri import edelim
import { DashboardContent } from '../components/DashboardContent';
import { InventoryContent } from '../components/InventoryContent';
import { RecipesContent } from '../components/RecipesContent';
import { CleaningContent } from '../components/CleaningContent';

export default function UserPage() {
    const { fetchProduct, updateBreakStatus, session } = UserAuth();
    const [product, setProduct] = useState([]); // Ürünleri yerel state'te tutmak için
    const [selectedProduct, setSelectedProduct] = useState(null); // Modal için seçilen ürün
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal durumu
    const [searchQuery, setSearchQuery] = useState(""); // Arama sorgusu
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isOnBreak, setIsOnBreak] = useState(false);
    const [breakStartTime, setBreakStartTime] = useState(null);
    const [shift, setShift] = useState({
        startTime: null,
        notes: '',
        handoverNotes: ''
    });
    const [inventory, setInventory] = useState({
        milk: 100,
        coffee: 100,
        syrup: 100,
        cups: 100
    });
    const [dailyStats, setDailyStats] = useState({
        totalDrinks: 0,
        totalSales: 0,
        averagePreparationTime: 0
    });
    const [cleaningTasks, setCleaningTasks] = useState([
        { id: 1, task: 'Espresso makinesi temizliği', completed: false },
        { id: 2, task: 'Öğütücü temizliği', completed: false },
        { id: 3, task: 'Tezgah temizliği', completed: false },
        { id: 4, task: 'Süt sürahileri temizliği', completed: false }
    ]);

    // Ürünleri çekmek için
    const handleFetchProduct = async () => {
        try {
            const data = await fetchProduct();
            setProduct(data);
        } catch (error) {
            console.error("Ürünler alınamadı:", error.message);
        }
    };

    // Modal açma
    const handleOpenModal = (item) => {
        setSelectedProduct(item);
        setIsModalOpen(true);
    };

    // Modal kapatma
    const handleCloseModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(false);
    };

    // Ürünleri filtreleme
    const filteredProducts = product.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Modified break toggle function
    const handleBreakToggle = async () => {
        if (!session?.user?.id) return; // Guard clause if no user is logged in

        const success = await updateBreakStatus(session.user.id, !isOnBreak);
        
        if (success) {
            if (isOnBreak) {
                setIsOnBreak(false);
                setBreakStartTime(null);
            } else {
                setIsOnBreak(true);
                setBreakStartTime(new Date());
            }
        } else {
            alert('Mola durumu güncellenirken bir hata oluştu.');
        }
    };

    const getBreakDuration = () => {
        if (!breakStartTime) return '0:00';
        const now = new Date();
        const diff = Math.floor((now - breakStartTime) / 1000); // saniye cinsinden
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full h-screen bg-[#09090b] text-white flex flex-col">
            {/* Header */}
            <div className="w-full h-[80px] px-5 flex items-center justify-between border-b border-[#ffffff2c]">
                <img src={""} alt="Logo" className="w-20 h-20" />
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">
                        {shift.startTime ? `Vardiya Başlangıcı: ${new Date(shift.startTime).toLocaleTimeString()}` : 'Vardiya Başlamadı'}
                    </span>
                    <AiOutlineUser
                        onClick={() => navigate("/profile")}
                        cursor="pointer"
                        size={35}
                        className="text-[#444343] hover:text-white transition-all duration-300"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className='p-5 w-full h-full grid grid-cols-12 gap-5'>
                {/* Sidebar */}
                <div className='col-span-12 md:col-span-2 bg-[#18181b] rounded-lg p-5 flex flex-col gap-4'>
                    {/* Navigation */}
                    <nav className="flex flex-col gap-2">
                        <button 
                            onClick={() => setActiveTab('dashboard')}
                            className={`flex items-center gap-2 p-2 rounded ${activeTab === 'dashboard' ? 'bg-[#27272a]' : ''}`}
                        >
                            <FiCoffee /> Dashboard
                        </button>
                        <button 
                            onClick={() => setActiveTab('inventory')}
                            className={`flex items-center gap-2 p-2 rounded ${activeTab === 'inventory' ? 'bg-[#27272a]' : ''}`}
                        >
                            <FiBox /> Stok Takibi
                        </button>
                        <button 
                            onClick={() => setActiveTab('recipes')}
                            className={`flex items-center gap-2 p-2 rounded ${activeTab === 'recipes' ? 'bg-[#27272a]' : ''}`}
                        >
                            <FiBook /> Tarifler
                        </button>
                        <button 
                            onClick={() => setActiveTab('cleaning')}
                            className={`flex items-center gap-2 p-2 rounded ${activeTab === 'cleaning' ? 'bg-[#27272a]' : ''}`}
                        >
                            <FiCheckSquare /> Temizlik
                        </button>
                    </nav>

                    {/* Break Button */}
                    <button 
                        onClick={handleBreakToggle}
                        className={`mt-4 px-4 py-2 rounded-lg transition-all duration-300 ${
                            isOnBreak 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {isOnBreak ? 'Molayı Bitir' : 'Molaya Çık'}
                    </button>

                    {isOnBreak && (
                        <div className="text-sm">
                            <p className="text-gray-400">Mola Süresi:</p>
                            <p className="font-bold">{getBreakDuration()}</p>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className='col-span-12 md:col-span-10 bg-[#18181b] rounded-lg p-5'>
                    {activeTab === 'dashboard' && (
                        <DashboardContent 
                            dailyStats={dailyStats}
                            shift={shift}
                            setShift={setShift}
                        />
                    )}
                    {activeTab === 'inventory' && (
                        <InventoryContent 
                            inventory={inventory}
                            setInventory={setInventory}
                        />
                    )}
                    {activeTab === 'recipes' && (
                        <RecipesContent />
                    )}
                    {activeTab === 'cleaning' && (
                        <CleaningContent 
                            tasks={cleaningTasks}
                            setTasks={setCleaningTasks}
                        />
                    )}
                </div>
            </div>

            {/* Search Bar */}
            <div className="p-5">
                <div className="flex items-center justify-center gap-5 w-full mb-5">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Ürün arayın..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-3 rounded-lg bg-[#18181b] text-white placeholder-gray-400 pr-12"
                        />
                        <AiOutlineSearch
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                    </div>
                    <AiOutlineReload
                        onClick={handleFetchProduct}
                        className="text-white cursor-pointer hover:text-gray-300"
                        size={35}
                    />
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-4">
                    {filteredProducts.map((item) => (
                        <div
                            key={item.id}
                            className="relative rounded-2xl flex flex-col items-center"
                        >
                            <img
                                src={item.image_url}
                                alt="Ürün Resmi"
                                className="w-full h-full object-cover rounded-lg"
                            />
                            <p className="text-white text-center text-sm mt-2">{item.name}</p>
                            <button
                                onClick={() => handleOpenModal(item)}
                                className="absolute -top-1 -right-1 bg-[#09090b] text-white p-2 rounded-full hover:bg-green-500 transition-all"
                            >
                                <FiPlus size={22} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-[#18181b] p-6 rounded-xl w-80">
                        <h2 className="text-xl font-bold mb-4 text-white">{selectedProduct?.name}</h2>
                        <p className="mb-4 text-gray-300">Bu içeceği içtiğinize emin misiniz?</p>
                        <select className="w-full p-3 bg-[#09090b] text-white rounded-lg mb-4">
                            <option value="1mola">1. Mola</option>
                            <option value="2mola">2. Mola</option>
                            <option value="atik">Atık</option>
                        </select>
                        <div className="flex justify-end">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-[#18181b] text-white rounded-lg hover:bg-gray-500 transition-all duration-300 border border-[#ffffff2c]"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
