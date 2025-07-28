"use client";
import React, { useState } from "react";

export default function Home() {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 gap-8">
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <button
            key={num}
            onClick={() => setSelectedFloor(num)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            {num}
          </button>
        ))}
      </div>

      {selectedFloor !== null && (
        <div className="text-xl font-semibold text-gray-800">
          {selectedFloor}階です
        </div>
      )}
    </div>
  );
}

