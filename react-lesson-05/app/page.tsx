"use client";
import React, { useState } from "react";

export default function Home() {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [showFloor, setShowFloor] = useState<boolean>(false);

  const handleFloorClick = (num: number) => {
    setSelectedFloor(num);
    setShowFloor(false); // 表示を一度リセット
  };

  const handleShowClick = () => {
    if (selectedFloor !== null) {
      setShowFloor(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 gap-8">
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <button
            key={num}
            onClick={() => handleFloorClick(num)}
            className={`${
              selectedFloor === num ? "bg-blue-800" : "bg-blue-600"
            } hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors`}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        onClick={handleShowClick}
        className="mt-4 bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded"
      >
        ▶|◀
      </button>
      <button
      	onClick={handleShowClick}
	>
      	◀|▶
      </button>

      {showFloor && selectedFloor !== null && (
        <div className="text-xl font-semibold text-gray-800">
          {selectedFloor}階です
        </div>
      )}
    </div>
  );
}

