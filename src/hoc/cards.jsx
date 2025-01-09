import React from 'react';
import { FaFileExcel } from "react-icons/fa6";
const Card = ({ day, month, year, save }) => {
    return (
        <section className="relative group flex flex-col flex-wrap w-full">
            <div className="file relative w-32 h-24 cursor-pointer origin-bottom [perspective:1500px] z-50"> {/* w-32 ve h-24 ile daha küçük boyutlar */}
                <div className="work-5 bg-[#032722] w-full h-full origin-top rounded-2xl rounded-tl-none group-hover:shadow-[0_20px_40px_rgba(0,0,0,.2)] transition-all ease duration-300 relative after:absolute after:content-[''] after:bottom-[99%] after:left-0 after:w-10 after:h-2 after:bg-[#032722] after:rounded-t-2xl before:absolute before:content-[''] before:-top-[10px] before:left-[45px] before:w-3 before:h-0 before:bg-[#032722] before:[clip-path:polygon(0_35%,0%_100%,50%_100%);]" ></div>
                <div className="work-2 absolute inset-1 bg-green-600 rounded-2xl transition-all ease duration-300 origin-bottom group-hover:transform group-hover:rotate-x-[-38deg] group-hover:translate-y-[-10px]">
                    <FaFileExcel fill={"white"} className="absolute top-0 left-0 right-[85px] bottom-7 mx-auto my-auto w-6 h-6" />
                    <span className="text-white font-bold absolute top-0 left-0 right-0 bottom-9 mx-auto my-auto w-6 h-6">Excel</span>
                </div>
                <div className={`work-1 absolute bottom-0 bg-gradient-to-t from-green-900 to-green-800 w-full h-[80px] rounded-2xl rounded-tr-none after:absolute after:content-[''] after:bottom-[99%] after:right-0 after:w-[90px] after:h-[12px] after:bg-green-800 after:rounded-t-2xl before:absolute before:content-[''] before:-top-[6px] before:right-[85px] before:size-3 before:bg-green-800 before:[clip-path:polygon(100%_14%,50%_100%,100%_100%);] transition-all ease duration-300 origin-bottom flex items-end  ${save === true ? "" : "group-hover:[transform:rotateX(-46deg)_translateY(1px)]"}`}>
                    {!save && (
                        <div className='flex h-full w-full items-center justify-center text-white font-bold text-md gap-2'>
                            {`${month === "01" ? "OCAK" : month === "02" ? "ŞUBAT" : month === "03" ? "MART" :
                                month === "04" ? "NİSAN" : month === "05" ? "MAYIS" : month === "06" ? "HAZİRAN" :
                                    month === "07" ? "TEMMUZ" : month === "08" ? "AĞUSTOS" : month === "09" ? "EYLÜL" :
                                        month === "10" ? "EKİM" : month === "11" ? "KASIM" : month === "12" ? "ARALIK" : "BOŞ"
                                }`}
                            <span>{day}</span>
                            <span>{year}</span>
                        </div>
                    )}
                    {save && (
                        <div className='flex h-full w-full items-center justify-center text-white font-bold text-2xl'>
                            <span>+</span>
                        </div>
                    )}
                </div>
            </div>

        </section>
    );
}

export default Card;
