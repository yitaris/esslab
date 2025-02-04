import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import { branches } from '../constants';
import { useNavigate } from 'react-router-dom';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const Branches = () => {
    const navigate = useNavigate();
    const goToLogin = (branchId) => {
        navigate(`/login/${branchId}`);
    };

    const slides = branches.map((branch) => (
        <SwiperSlide
            key={branch.id}
            className="w-full h-full flex items-center justify-center cursor-pointer"
            onClick={() => goToLogin(branch.id)}
        >
            <div className="relative w-[300px] h-[400px] rounded-xl overflow-hidden transition-transform transform hover:scale-110">
                <img
                    src={branch.image_url}
                    alt={branch.name}
                    className="object-cover w-full h-full opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                <h1 className="absolute bottom-5 left-5 text-white text-2xl font-bold">
                    {branch.name}
                </h1>
            </div>
        </SwiperSlide>
    ));

    return (
        <div className="w-full h-screen bg-[#121212] flex flex-col items-center py-6">
            {/* Logo */}
            <div>
            <img 
                src={""}
                alt="UB Gıda Logo"
                className="w-[200px] h-auto mb-6"
            />
           </div>
            
            {/* Slider */}
            <div className="w-full h-full max-w-[1200px] flex items-center justify-center">
                <Swiper
                    className="w-full h-full"
                    modules={[EffectCoverflow]}
                    effect="coverflow"
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 50,
                        depth: 150,
                        modifier: 1.5,
                        slideShadows: false,
                    }}
                    grabCursor={true}
                    centeredSlides={true}
                    spaceBetween={30}
                    slidesPerView={3}
                    loop={true}
                >
                    {slides}
                </Swiper>
            </div>
        </div>
    );
};

export default Branches;
