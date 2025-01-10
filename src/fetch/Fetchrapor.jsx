import React, { useState, useEffect } from 'react';
import { categories } from '../constants';
import { ubgida2 } from '../assets';
import ExcelJS from 'exceljs';
import CardElements from '../hoc/cards';
import { useSupabase } from '../context/SupabaseContext';

import { IoCaretBackOutline } from "react-icons/io5";
import { MdSaveAs } from "react-icons/md";

export default function Fetchrapor() {
    const { fetchExcelDatabase, loading, excelDataPublic, saveAndStoreExcelReport, handleDrop, downloadFile } = useSupabase();
    const [showTable, setShowTable] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [savedReports, setSavedReports] = useState([]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const dropDrag = async (e) => {
        e.preventDefault();
        setDragOver(false);

        const file = e.dataTransfer.files[0];
        const fileName = file.name;
        const filePath = `raporlar/${file.name}`;

        handleDrop(filePath, file, fileName);
    }



    useEffect(() => {
        fetchExcelDatabase();
    }, [])

    const [dataExcel, setDataExcel] = useState(
        categories.reduce((acc, category) => {
            acc[category.name] = Array.from({ length: category.rows }, () =>
                Array(9).fill('')
            );
            return acc;
        }, {})
    );
    const handleChange = (categoryName, rowIndex, columnIndex, value) => {
        setDataExcel((prevData) => {
            const updatedCategory = [...prevData[categoryName]];
            updatedCategory[rowIndex][columnIndex] = value;
            return { ...prevData, [categoryName]: updatedCategory };
        });
    };

    if (loading)
        return (
            <div className="absolute inset-0 grid place-content-center">
                <img
                    src={ubgida2}
                    alt="Loading..."
                    className="w-30 h-30 animate-pulse"
                />
            </div>
        );

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

            dataExcel[category.name].forEach((row, index) => {
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
        saveAndStoreExcelReport(filename, buffer);
        setSavedReports((prevReports) => [...prevReports, `${day}-${month}-${year}`]);
        setShowTable(false);
    };

    const renderTable = (category) => (
        <div key={category.name} className="mb-5">
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-[#032722] text-sm">
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
                                            value={dataExcel[category.name][rowIndex][columnIndex]}
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
            <div className="w-full h-full bg-gray-50  lg:rounded-2xl shadow-lg relative grid">
                {showTable && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                        <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-h-[80vh] overflow-y-auto">
                            <div className="p-0">
                                <div className='flex items-center justify-between'>
                                    <button
                                        onClick={() => setShowTable(false)}
                                        className="text-[#032722] hover:text-green-700 p-2"
                                    >

                                        <IoCaretBackOutline size={30} />
                                    </button>
                                    <button
                                        onClick={exportToExcel}
                                        className={`p-2 bg-[#032722] hover:bg-green-700 text-white rounded mr-2`}
                                    >
                                        <MdSaveAs />
                                    </button>
                                </div>
                                {categories.map(renderTable)}


                            </div>
                        </div>
                    </div>
                )}

                {!showTable && (
                    <div className='h-full grid 2xl:grid-cols-10 xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2'>
                        {excelDataPublic.map((item, index) => (
                            <div
                                key={index}
                                className=''
                                onClick={() => downloadFile(item.dosya_url)} // Anonim fonksiyon ekliyoruz
                            >
                                <CardElements
                                    day={`${new Date(item.time).toLocaleDateString("tr-TR", {
                                        day: "2-digit",
                                    })}`}
                                    month={`${new Date(item.time).toLocaleDateString("tr-TR", {
                                        month: "2-digit",
                                    })}`}
                                    year={`${new Date(item.time).toLocaleDateString("tr-TR", {
                                        year: "numeric",
                                    })}`}
                                />
                            </div>
                        ))}
                        <button
                            onClick={() => setShowTable(true)}
                            onDragOver={handleDragOver}
                            onDrop={dropDrag}
                            className="h-24 w-32 opacity-50 text-red hover:opacity-100"
                        >
                            <CardElements save={true} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
