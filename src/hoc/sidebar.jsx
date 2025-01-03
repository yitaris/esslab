import React from 'react';

const Sidebar = () => {
  return (
    <div className="relative flex flex-col items-center justify-center rounded-full">
      <div className="absolute w-full h-full rounded-full z-[-1] flex items-center justify-center overflow-hidden">
        <div className="absolute h-[10.5rem] w-[10.5rem] rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 animate-spin"></div>
        <div className="absolute h-full w-full backdrop-blur-md rounded-full z-[1]"></div>
      </div>
      <button className="relative flex items-center justify-center transition-all transform duration-300 h-14 w-14 bg-transparent rounded-full p-2 hover:scale-105 group">
        <svg
          className="h-full w-full p-2 rounded-full bg-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-300"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          fill="none"
        >
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
        <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 bg-white px-2 py-1 rounded-md text-sm font-semibold text-black transition-all duration-300">
          x
        </span>
      </button>
      <button className="relative flex items-center justify-center transition-all transform duration-300 h-14 w-14 bg-transparent rounded-full p-2 hover:scale-105 group mt-4">
        <svg
          className="h-full w-full p-2 rounded-full bg-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-300"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          fill="none"
        >
          <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
        </svg>
        <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 bg-white px-2 py-1 rounded-md text-sm font-semibold text-black transition-all duration-300">
          GitHub
        </span>
      </button>
      <button className="relative flex items-center justify-center transition-all transform duration-300 h-14 w-14 bg-transparent rounded-full p-2 hover:scale-105 group mt-4">
        <svg
          className="h-full w-full p-2 rounded-full bg-gray-100 group-hover:bg-white group-hover:scale-110 transition-all duration-300"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          fill="none"
        >
          <path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
          <path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
          <path d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-.972 1.923a11.913 11.913 0 0 0 -4.053 0l-.975 -1.923c-1.5 .16 -3.043 .485 -4.5 1.5c-2 5.667 -2.167 9.833 -1.5 11.5c.667 1.333 2 3 3.5 3c.5 0 2 -2 2 -3" />
          <path d="M7 16.5c3.5 1 6.5 1 10 0" />
        </svg>
        <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 bg-white px-2 py-1 rounded-md text-sm font-semibold text-black transition-all duration-300">
          Discord
        </span>
      </button>
    </div>
  );
};

export default Sidebar;
