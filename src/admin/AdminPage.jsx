import React, { useState, useEffect } from 'react';
import { UserAuth } from '../context/SupabaseContext';
import { useNavigate } from 'react-router-dom';
/* Images */
import { ubgida } from '../assets';
/* Icons */
import { AiOutlineUser } from "react-icons/ai";
import { FiUsers, FiCoffee, FiBox, FiBook, FiCheckSquare } from "react-icons/fi";

// Vardiya seçenekleri için array ekleyelim
const vardiyaOptions = ['08:00-17:00', '16:00-01:00', '12:00-21:00'];
const temizlikOptions = ['Bar', 'Dış Alan', 'Üst Alan'];

// Yanıp sönme animasyonu için CSS keyframes ekleyin (style tag'i içinde)
const pulseAnimation = `
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

export default function AdminPage() {
    const { session, user, fetchBranchUsers, updateUserShiftAndCleaning } = UserAuth(); // Kullanıcı bilgileri ve fonksiyonlar
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('users');

    const handleVardiyaChange = (userId, value) => {
        setUsers(users.map(user => 
            user.id === userId ? {...user, vardiya: value} : user
        ));
    };

    const handleTemizlikChange = (userId, value) => {
        setUsers(users.map(user => 
            user.id === userId ? {...user, temizlik: value} : user
        ));
    };

    const handleSaveChanges = async (userId) => {
        const userToUpdate = users.find(user => user.id === userId);
        try {
            const success = await updateUserShiftAndCleaning(
                userId, 
                userToUpdate.vardiya, 
                userToUpdate.temizlik
            );
            
            if (success) {
                alert('Değişiklikler başarıyla kaydedildi');
                // Güncel kullanıcı listesini yeniden yükle
                const updatedUsers = await fetchBranchUsers(user.branch_id);
                setUsers(updatedUsers);
            } else {
                alert('Değişiklikler kaydedilirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Bir hata oluştu');
        }
    };

    useEffect(() => {
        // branch_id'ye göre kullanıcıları çek
        const loadUsers = async () => {
            if (user?.branch_id) {
                const branchUsers = await fetchBranchUsers(user.branch_id);
                setUsers(branchUsers);
            }
        };
        loadUsers();
    }, [user]);

    return (
        <div className="w-full h-screen bg-[#09090b] text-white flex flex-col">
            <style>{pulseAnimation}</style>
            {/* Header */}
            <div className="w-full h-[80px] px-5 flex items-center justify-between border-b border-[#ffffff2c]">
                <img src={ubgida} alt="Logo" className="w-20 h-20" />
                <div className="flex items-center gap-4">
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
                    <nav className="flex flex-col gap-2">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`flex items-center gap-2 p-2 rounded ${activeTab === 'users' ? 'bg-[#27272a]' : ''}`}
                        >
                            <FiUsers /> Çalışanlar
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex items-center gap-2 p-2 rounded ${activeTab === 'orders' ? 'bg-[#27272a]' : ''}`}
                        >
                            <FiCoffee /> Siparişler
                        </button>
                        <button
                            onClick={() => setActiveTab('inventory')}
                            className={`flex items-center gap-2 p-2 rounded ${activeTab === 'inventory' ? 'bg-[#27272a]' : ''}`}
                        >
                            <FiBox /> Stok Durumu
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
                            <FiCheckSquare /> Temizlik Kontrol
                        </button>
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className='col-span-12 md:col-span-10 bg-[#18181b] rounded-lg p-5'>
                    {activeTab === 'users' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {users.map((user) => (
                                <div key={user.id} className="bg-[#27272a] p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 relative">
                                    {/* Mola durumu için yanıp sönen indicator */}
                                    {user.mola && (
                                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
                                    )}
                                    
                                    {/* Kullanıcı başlık kısmı */}
                                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#ffffff1a]">
                                        <div className="w-12 h-12 bg-[#3f3f46] rounded-full flex items-center justify-center">
                                            <AiOutlineUser size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{user.name}</h3>
                                            <span className={`text-sm ${user.mola ? 'text-red-400' : 'text-green-400'}`}>
                                                {user.mola ? 'Molada' : 'Çalışıyor'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Vardiya seçimi */}
                                    <div className="mb-4">
                                        <label className="text-sm text-gray-400 block mb-2">Vardiya</label>
                                        <select
                                            value={user.vardiya}
                                            onChange={(e) => handleVardiyaChange(user.id, e.target.value)}
                                            className="w-full bg-[#3f3f46] rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {vardiyaOptions.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Temizlik durumu seçimi */}
                                    <div className="mb-4">
                                        <label className="text-sm text-gray-400 block mb-2">Temizlik</label>
                                        <select
                                            value={user.temizlik}
                                            onChange={(e) => handleTemizlikChange(user.id, e.target.value)}
                                            className="w-full bg-[#3f3f46] rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {temizlikOptions.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Kaydet butonu */}
                                    <button
                                        onClick={() => handleSaveChanges(user.id)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
                                    >
                                        Değişiklikleri Kaydet
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
