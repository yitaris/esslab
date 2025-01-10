import React from 'react';
import { ubvideo } from '../assets';

function VideoGrid() {
  const gridItems = Array.from({ length: 12 }, (_, index) => {
    const row = Math.floor(index / 4); // Satır numarası (0-2)
    const col = index % 4;             // Sütun numarası (0-3)

    return (
      <div
        key={index}
        className="aspect-square w-[300px] h-[300px]"
        style={{
          clipPath: `polygon(${col * 25}% ${row * 33.33}%, ${(col + 1) * 25}% ${row * 33.33}%, ${(col + 1) * 25}% ${(row + 1) * 33.33}%, ${col * 25}% ${(row + 1) * 33.33}%)`
        }}
      >
        <video
          className="object-cover w-[800px] h-[800px]"
          style={{ transform: `translate(-${col * 25}%, -${row * 33.33}%)` }}
          autoPlay
          muted
          loop
        >
          <source src={ubvideo} type="video/mp4" />
        </video>
      </div>
    );
  });

  return (
    <div className="grid grid-cols-4 grid-rows-3">
      {gridItems}
    </div>
  );
}

export default VideoGrid;
