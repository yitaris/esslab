import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { supabase } from "../lib/supabaseClient";
import { useSupabase } from "../context/SupabaseContext";
import { categories } from "../constants";

Modal.setAppElement("#root");

const year = 2025; // Takvim yılı
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
  daysInMonth[1] = 29; // Artık yıl kontrolü
}

const Fetchrapor = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tableData, setTableData] = useState({});
  const [currentData, setCurrentData] = useState([]);
  const { saveData } = useSupabase();

  useEffect(() => {
    fetchCalendarData(); // Supabase'den verileri yükle
  }, []);

  const fetchCalendarData = async () => {
    const { data, error } = await supabase.from("raporlar").select("*");
    if (error) {
      console.error("Veriler alınamadı:", error.message);
    } else {
      const formattedData = {};
      data.forEach((item) => {
        formattedData[item.date_key] = item.table_data;
      });
      setTableData(formattedData);
    }
  };

  const saveDataFunction = async () => {
    saveData(selectedDate, tableData, currentData);
    const updatedTableData = { ...tableData, [selectedDate.key]: currentData };
    setTableData(updatedTableData);
    closeModal();
  };

  const openModal = (month, day) => {
    setSelectedDate({ month, day, key: `${month}-${day}` });
    const key = `${month}-${day}`;
    setCurrentData(tableData[key] || Array.from({ length: 84 }, () => Array(10).fill(""))); // 9 satır ve 10 sütun
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDate(null);
  };

  const handleTableChange = (row, col, value) => {
    const updatedData = [...currentData];
    updatedData[row][col] = value;
    setCurrentData(updatedData);
  };

  return (
    <div className="w-full h-full relative lg:p-10 text-black">
      <div className="bg-white w-full h-full p-5 rounded-2xl overflow-hidden overflow-y-scroll shadow-lg">
        <h1 className="text-center text-2xl font-semibold mb-5">Yıllık Takvim ({year})</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {daysInMonth.map((days, monthIndex) => (
            <div key={monthIndex} className="border p-4 rounded-lg shadow-md hover:bg-gray-100">
              <h2 className="text-center font-semibold mb-2 text-lg">
                {new Date(year, monthIndex).toLocaleString("tr-TR", { month: "long" })}
              </h2>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: days }).map((_, dayIndex) => (
                  <button
                    key={dayIndex}
                    className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm text-black transition duration-200"
                    onClick={() => openModal(monthIndex + 1, dayIndex + 1)}
                  >
                    {dayIndex + 1}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={modalOpen}
          onRequestClose={closeModal}
          className="bg-white rounded-2xl p-5 w-[90%] h-[90%] text-black overflow-hidden overflow-y-scroll shadow-xl"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <h2 className="text-center text-xl font-semibold mb-4">
            {selectedDate && `${selectedDate.day} ${new Date(year, selectedDate.month - 1).toLocaleString("tr-TR", { month: "long" })}`}
          </h2>
          <div className="overflow-x-auto overflow-y-scroll">
            {categories.map((category, index) => (
              <div key={index} className="mb-5">
                <table className="table-auto border-collapse w-full mb-4">
                  <thead>
                    <tr>
                      {category.columns.map((column, colIndex) => (
                        <th key={colIndex} className="border px-4 py-2 bg-green-200 font-bold">{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {category.alt.map((item, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="border px-4 py-2 bg-green-50 font-semibold">{item}</td>
                        {Array.from({ length: 9 }).map((_, colIndex) => (
                          <td key={colIndex} className="border px-4 py-2">
                            <input
                              type="text"
                              className="w-full p-2 border rounded-md"
                              value={currentData[rowIndex] ? currentData[rowIndex][colIndex + 1] : ""}
                              onChange={(e) => handleTableChange(rowIndex, colIndex + 1, e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded-lg mr-2">İptal</button>
            <button onClick={saveDataFunction} className="px-4 py-2 bg-green-600 text-white rounded-lg">Kaydet</button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Fetchrapor;
