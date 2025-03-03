import { useState, useEffect } from "react";

export default function ProductFilter({ onFilterChange, filters }) {
  const [specICT, setSpecICT] = useState(filters.specICT);
  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);

  useEffect(() => {
    onFilterChange({ specICT, minPrice, maxPrice });
  }, [specICT, minPrice, maxPrice]);

  const handleMinPriceChange = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - 1);
    setMinPrice(value >= 0 ? value : 0);
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + 1);
    setMaxPrice(value <= 99999 ? value : 99999);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">เลือกการแสดงสินค้า</h2>

      {/* ✅ Checkbox ICT */}
      <div className="flex items-center gap-2 mb-8">
        <input
          type="checkbox"
          checked={specICT}
          onChange={() => setSpecICT(!specICT)}
          className="w-5 h-5 cursor-pointer"
        />
        <label className="text-gray-700 font-medium cursor-pointer">ICT</label>
      </div>

      {/* ✅ ช่วงราคา */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">ช่วงราคา</h3>

        {/* 🎯 Input สำหรับกรอกตัวเลข */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="number"
            value={minPrice}
            onChange={handleMinPriceChange}
            className="w-full border rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-blue-400"
            min="0"
            max={maxPrice - 1}
          />
          <span className="text-lg">-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            className="w-full border rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-blue-400"
            min={minPrice + 1}
            max="99999"
          />
        </div>

        {/* 🎚️ Slider สองจุด */}
        <div className="relative w-full h-12 flex items-center">
          {/* 🎚️ Slider สำหรับ Min */}
          <input
            type="range"
            min="0"
            max="99999"
            value={minPrice}
            onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 1))}
            className="slider min-slider"
          />

          {/* 🎚️ Slider สำหรับ Max */}
          <input
            type="range"
            min="0"
            max="99999"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 1))}
            className="slider max-slider"
          />
        </div>
      </div>

      {/* ✅ Custom CSS */}
      <style jsx>{`
        .slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 0px;
          background: transparent;
          pointer-events: none; /* ป้องกัน Track ทับ */
          position: absolute;
        }

        /* 🎨 Track */
        .slider::-webkit-slider-runnable-track {
          height: 6px;
          background-color: #d1d5db; /* สีเทา */
          border-radius: 3px;
          z-index: 0; /* ให้ Track อยู่ล่างสุด */
          position: relative;
        }

        /* 🔴 Thumb */
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: #ef4444; /* สีแดง */
          border: 2px solid #b91c1c;
          cursor: pointer;
          position: relative;
          z-index: 2; /* ให้ Thumb อยู่บนสุด */
          margin-top: -6px; /* จัดให้ Thumb อยู่ตรงกลาง */
          pointer-events: auto; /* ทำให้ลากได้ */
        }

        /* สำหรับ Firefox */
        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: #ef4444;
          border: 2px solid #b91c1c;
          cursor: pointer;
          z-index: 2;
        }
      `}</style>
    </div>
  );
}
