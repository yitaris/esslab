import React, { useState, useEffect } from 'react';
import { categories } from '../constants';
import ExcelJS from 'exceljs';
import CardElements from '../hoc/cards';

import { useSupabase } from '../context/SupabaseContext';

export default function Fetchrapor() {
    const { saveExcelDatabase, fetchExcelDatabase,} = useSupabase();
  

    
    const [data, setData] = useState(
        categories.reduce((acc, category) => {
            acc[category.name] = Array.from({ length: category.rows }, () =>
                Array(9).fill('')
            );
            return acc;
        }, {})
    );

    const [showTable, setShowTable] = useState(false);
    const [savedReports, setSavedReports] = useState([]);

    const handleChange = (categoryName, rowIndex, columnIndex, value) => {
        setData((prevData) => {
            const updatedCategory = [...prevData[categoryName]];
            updatedCategory[rowIndex][columnIndex] = value;
            return { ...prevData, [categoryName]: updatedCategory };
        });
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Rapor');

        categories.forEach((category) => {
            const headerRow = worksheet.addRow([
                category.name, 'AÇILIŞ', 'GELEN', 'TOPLAM', 'TADIM',
                'ATIK', 'SATIŞ', 'KAPANIŞ', 'FARK', 'ÜRÜN BİTİŞ SAATİ'
            ]);

            headerRow.eachCell((cell) => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'C0EBA6' }
                };
                cell.font = { bold: true };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

            data[category.name].forEach((row, index) => {
                const newRow = worksheet.addRow([category.alt[index], ...row]);
                newRow.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });

            worksheet.addRow([]);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);

        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const filename = `${day}-${month}-${year}_rapor.xlsx`;

        link.download = filename;
        link.click();

        // Save the report's date as a history entry
        setSavedReports((prevReports) => [...prevReports, `${day}-${month}-${year}`]);
        setShowTable(false);
    };

    const renderTable = (category) => (
        <div key={category.name} className="mb-5">
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="border border-gray-300 px-4 py-2 text-center w-[200px]">{category.name}</th>
                            <th className="border border-gray-300 px-4 py-2">AÇILIŞ</th>
                            <th className="border border-gray-300 px-4 py-2">GELEN</th>
                            <th className="border border-gray-300 px-4 py-2">TOPLAM</th>
                            <th className="border border-gray-300 px-4 py-2">TADIM</th>
                            <th className="border border-gray-300 px-4 py-2">ATIK</th>
                            <th className="border border-gray-300 px-4 py-2">SATIŞ</th>
                            <th className="border border-gray-300 px-4 py-2">KAPANIŞ</th>
                            <th className="border border-gray-300 px-4 py-2">FARK</th>
                            <th className="border border-gray-300 px-4 py-2">ÜRÜN BİTİŞ SAATİ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: category.rows }).map((_, rowIndex) => (
                            <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                                <td className="border border-gray-300 px-4 py-2 text-center">{category.alt[rowIndex]}</td>
                                {[...Array(9)].map((_, columnIndex) => (
                                    <td key={columnIndex} className="border border-gray-300 px-4 py-2">
                                        <input
                                            type="text"
                                            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            value={data[category.name][rowIndex][columnIndex]}
                                            onChange={(e) =>
                                                handleChange(category.name, rowIndex, columnIndex, e.target.value)
                                            }
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="w-full h-full lg:px-10">
            <div className="bg-gray-50 rounded-2xl shadow-lg p-5 h-full relative overflow-hidden grid grid-rows-[1fr,50px]" style={{ maxHeight: '90vh' }}>
                {showTable && (
                    <div>
                        <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 100px)' }}>
                            {categories.map(renderTable)}
                        </div>
                        <button
                            onClick={exportToExcel}
                            className="mt-5 px-4 py-2 bg-green-500 text-white rounded"
                        >
                            Excel'e Aktar
                        </button>
                        <button
                            onClick={() => setShowTable(false)}
                            className="mt-5 ml-2 px-4 py-2 bg-gray-500 text-white rounded"
                        >
                            Geri Çık
                        </button>
                    </div>
                )}

                {!showTable && (
                    <div className="h-full flex flex-wrap gap-3">
                        
                        <CardElements />
                        <CardElements />
                        <CardElements />
                        <CardElements />
                    </div>
                )}
                {!showTable && (
                    <button
                        onClick={() => setShowTable(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded w-[150px]"
                    >
                        Rapor Oluştur
                    </button>
                )}
                
            </div>
        </div>
    );
}
