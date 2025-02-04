import React, { useState, useEffect } from 'react';
import { UserAuth } from '../context/SupabaseContext';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiBox, FiBook, FiCheckSquare, FiCoffee, FiSearch, FiMoon, FiSun, FiBell, FiDownload, FiArrowRight } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { AiOutlineUser, AiOutlinePoweroff } from "react-icons/ai";
import AdminPanel from './pages/AdminPanel';
import AdminAttendance from './pages/AdminAttendance';

const menuItems = [
  { id: 'dashboard', title: 'Dashboard', icon: <FiBook /> },
  { id: 'attendance', title: 'Attendance', icon: <FiUsers /> },
  { id: 'payroll', title: 'Payroll', icon: <FiCheckSquare /> },
  { id: 'reports', title: 'Reports', icon: <FiCoffee /> },
];

export default function AdminPage() {
  const { user, signOut } = UserAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Sidebar */}
      <div className="w-20 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-6 transition-colors duration-200">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-12 h-12 bg-purple-600 dark:bg-purple-500 rounded-xl flex items-center justify-center">
            <FiBook className="w-6 h-6" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-purple-600 dark:bg-purple-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {React.cloneElement(item.icon, { className: "w-6 h-6" })}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="h-16 px-6 flex items-center justify-end border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-100 dark:bg-gray-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-colors duration-200"
              />
            </div>
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <FiSun className="w-5 h-5 text-yellow-500" />
              ) : (
                <FiMoon className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {/* Notifications Button and Dropdown */}
            <div className="relative dropdown-container">
              <button 
                className="p-2 hover:bg-[#2C2C2E] rounded-lg relative"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
              >
                <FiBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-600 rounded-full"></span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#2C2C2E] rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#3C3C3E]">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {/* Sample notifications */}
                    <div className="px-4 py-3 hover:bg-[#3C3C3E] cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                          <FiDownload className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm">New report available</p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Button and Dropdown */}
            <div className="relative dropdown-container">
              <button 
                className="ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
              >
                <img
                  src={user?.avatar_url || "default-avatar.png"}
                  alt="Profile"
                  className="w-10 h-10 rounded-lg object-cover"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#2C2C2E] rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#3C3C3E]">
                    <p className="font-semibold">{user?.email}</p>
                    <p className="text-sm text-gray-400">Admin</p>
                  </div>
                  <div className="py-1">
                    <button className="w-full px-4 py-2 text-left hover:bg-[#3C3C3E] flex items-center gap-2">
                      <AiOutlineUser className="w-5 h-5" />
                      Profile Settings
                    </button>
                    <button 
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left hover:bg-[#3C3C3E] text-red-400 flex items-center gap-2"
                    >
                      <AiOutlinePoweroff className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 overflow-y-auto h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          {activeTab === 'dashboard' && (
            <AdminPanel />
          )}
          {activeTab === 'attendance' && (
            <AdminAttendance />
          )}
          {/* Other tab contents */}
        </main>
      </div>
    </div>
  );
}
