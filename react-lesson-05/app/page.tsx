"use client";
import React, { useState, useEffect } from "react";

export default function ElevatorApp() {
  const [selectedFloors, setSelectedFloors] = useState([]);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [isMoving, setIsMoving] = useState(false);
  const [queue, setQueue] = useState([]);
  const [doorOpen, setDoorOpen] = useState(true);

  // エレベーターの移動処理
  useEffect(() => {
    if (queue.length > 0 && !isMoving && doorOpen) {
      const nextFloor = queue[0];
      if (nextFloor !== currentFloor) {
        // まずドアを閉める
        setDoorOpen(false);
        
        // ドアが閉まるまで少し待ってから移動開始
        setTimeout(() => {
          setIsMoving(true);
          
          // 移動時間計算（1階につき2400ms）
          const moveTime = Math.abs(nextFloor - currentFloor) * 2400;
          
          setTimeout(() => {
            setCurrentFloor(nextFloor);
            setQueue(prev => prev.slice(1));
            setIsMoving(false);
            
            // 到着後ドアを開ける
            setTimeout(() => {
              setDoorOpen(true);
            }, 500);
          }, moveTime);
        }, 600); // ドア閉鎖時間
      } else {
        setQueue(prev => prev.slice(1));
      }
    }
  }, [queue, isMoving, currentFloor, doorOpen]);

  const handleFloorClick = (num) => {
    if (num === currentFloor) return;
    
    if (selectedFloors.includes(num)) {
      setSelectedFloors(prev => prev.filter(f => f !== num));
    } else {
      setSelectedFloors(prev => [...prev, num]);
    }
  };

  const handleStartMovement = () => {
    if (selectedFloors.length === 0) return;
    
    // 効率的な順序でソート
    const sortedFloors = [...selectedFloors].sort((a, b) => {
      const distA = Math.abs(a - currentFloor);
      const distB = Math.abs(b - currentFloor);
      return distA - distB;
    });
    
    setQueue(prev => [...prev, ...sortedFloors]);
    setSelectedFloors([]);
  };

  const handleClearSelection = () => {
    setSelectedFloors([]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 gap-8">
      {/* エレベーター表示部 */}
      <div className="bg-black rounded-lg p-6 shadow-lg">
        <div className="text-center">
          <div className="text-4xl font-bold text-green-400 mb-2 font-mono">
            {currentFloor}階
          </div>
          <div className="text-sm text-gray-300">
            {isMoving ? '移動中...' : doorOpen ? 'ドア開放中' : 'ドア閉鎖中'}
          </div>
          
          {/* ドア表示 */}
          <div className="mt-4 relative h-12 bg-gray-600 rounded overflow-hidden">
            <div className={`absolute inset-0 flex transition-transform duration-500 ${
              doorOpen ? '' : 'transform scale-x-0'
            }`}>
              <div className={`w-1/2 bg-gray-300 border-r border-gray-500 transition-transform duration-500 ${
                doorOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
              }`}></div>
              <div className={`w-1/2 bg-gray-300 border-l border-gray-500 transition-transform duration-500 ${
                doorOpen ? 'transform translate-x-0' : 'transform translate-x-full'
              }`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 階数ボタン */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <button
            key={num}
            onClick={() => handleFloorClick(num)}
            className={`relative py-2 px-4 rounded font-bold transition-colors ${
              currentFloor === num
                ? "bg-green-600 text-white"
                : selectedFloors.includes(num)
                ? "bg-blue-800 text-white"
                : queue.includes(num)
                ? "bg-yellow-500 text-black animate-pulse"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {num}
            {selectedFloors.includes(num) && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
            )}
            {queue.includes(num) && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            )}
          </button>
        ))}
      </div>

      {/* 操作ボタン */}
      {selectedFloors.length > 0 && (
        <div className="flex gap-4">
          <button
            onClick={handleStartMovement}
            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded"
          >
            ▶|◀ 移動開始 ({selectedFloors.length})
          </button>
          <button
            onClick={handleClearSelection}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            ◀|▶ クリア
          </button>
        </div>
      )}

      {/* 選択中の階数表示 */}
      {selectedFloors.length > 0 && (
        <div className="text-lg font-semibold text-gray-800">
          選択中: {selectedFloors.sort((a, b) => a - b).join(', ')}階
        </div>
      )}

      {/* 待機中の階数表示 */}
      {queue.length > 0 && (
        <div className="text-lg font-semibold text-orange-600">
          待機中: {queue.join(', ')}階
        </div>
      )}
    </div>
  );
}