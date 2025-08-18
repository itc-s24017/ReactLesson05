'use client'

import { useEffect, useState } from 'react'

interface FloorPositions {
  [key: number]: number
}

export default function ElevatorSimulator() {
  const [currentFloor, setCurrentFloor] = useState<number>(1)
  const [isMoving, setIsMoving] = useState<boolean>(false)
  const [floorQueue, setFloorQueue] = useState<number[]>([])
  const [doorsOpen, setDoorsOpen] = useState<boolean>(true) // 初期状態をドア開に変更
  const [waitingForDoorClose, setWaitingForDoorClose] = useState<boolean>(false)

  const floorPositions: FloorPositions = {
    1: 420,
    2: 350,
    3: 280,
    4: 210,
    5: 140,
    6: 70
  }

  const selectFloor = (floor: number) => {
    // ドアが閉じている時は階数ボタンを押せない
    if (!doorsOpen) return
    
    if (floor === currentFloor) return

    // キューに追加（重複チェック）
    if (!floorQueue.includes(floor)) {
      setFloorQueue(prev => [...prev, floor])
      updateButtonState(floor, 'selected')
    }
  }

  const openDoor = () => {
    if (isMoving) return

    setDoorsOpen(true)
    setWaitingForDoorClose(false)
    const elevatorCar = document.getElementById('elevator-car')
    if (elevatorCar) {
      elevatorCar.classList.add('doors-open')
    }

    updateStatus('停止中・ドア開')
    updateDoorStatus('ドア: 開いています')
    updateButtonStates('open-btn', true)
    updateButtonStates('close-btn', false)
    
    // ドアが開いた時に階数ボタンを有効化
    updateFloorButtonsDisability(false)
  }

  const closeDoor = () => {
    if (isMoving) return

    setDoorsOpen(false)
    const elevatorCar = document.getElementById('elevator-car')
    if (elevatorCar) {
      elevatorCar.classList.remove('doors-open')
    }

    updateStatus('停止中・ドア閉')
    updateDoorStatus('ドア: 閉じています')
    updateButtonStates('open-btn', false)
    updateButtonStates('close-btn', true)
    
    // ドアが閉じた時に階数ボタンを無効化
    updateFloorButtonsDisability(true)

    // ドアを閉じた後、キューがあれば移動開始
    if (floorQueue.length > 0) {
      updateStatus('移動準備中...')
      setTimeout(() => {
        if (floorQueue.length > 0) {
          const nextFloor = floorQueue[0]
          setFloorQueue(prev => prev.slice(1))
          moveToFloor(nextFloor)
        }
      }, 500)
    }

    setWaitingForDoorClose(false)
  }

  const clearQueue = () => {
    if (isMoving) return // 移動中は解除不可

    setFloorQueue([])
    updateAllButtonStates()
  }

  const processQueue = (queue: number[]) => {
    // この関数は移動完了後の次の階層処理にのみ使用
    if (queue.length === 0 || isMoving || doorsOpen) return

    const nextFloor = queue[0]
    setFloorQueue(prev => prev.slice(1))
    moveToFloor(nextFloor)
  }

  const moveToFloor = (targetFloor: number) => {
    if (isMoving) return

    setIsMoving(true)
    updateStatus(`${targetFloor}階へ移動中...`)

    const elevatorCar = document.getElementById('elevator-car')
    if (elevatorCar) {
      const targetPosition = floorPositions[targetFloor]
      elevatorCar.style.top = targetPosition + 'px'
    }

    // 移動完了後の処理
    setTimeout(() => {
      setCurrentFloor(targetFloor)
      setIsMoving(false)

      // UI更新
      updateCurrentFloor(`${targetFloor}F`)
      updateStatus('到着・ドア開')
      
      // 到着時に自動的にドアを開く
      setDoorsOpen(true)
      const elevatorCar = document.getElementById('elevator-car')
      if (elevatorCar) {
        elevatorCar.classList.add('doors-open')
      }
      updateDoorStatus('ドア: 開いています')
      updateButtonStates('open-btn', true)
      updateButtonStates('close-btn', false)
      
      // 階数ボタンを有効化
      updateFloorButtonsDisability(false)

      // ボタン状態更新
      updateAllButtonStates()

      // 次の階層があれば待機（ドアが閉じられるまで）
      // 自動で次の階層には移動しない - ユーザーが手動でドアを閉じる必要がある

    }, 2000) // 2秒の移動時間
  }

  const updateButtonState = (floor: number, state: string) => {
    const button = document.getElementById(`btn-${floor}`)
    if (button) {
      button.className = `floor-button ${state}`
    }
  }

  const updateAllButtonStates = () => {
    for (let floor = 1; floor <= 6; floor++) {
      const button = document.getElementById(`btn-${floor}`) as HTMLButtonElement
      if (button) {
        if (floor === currentFloor) {
          button.className = 'floor-button current'
        } else if (floorQueue.includes(floor)) {
          button.className = 'floor-button selected'
        } else {
          button.className = 'floor-button'
        }
        
        // ドアの状態に応じてボタンの有効/無効を設定
        button.disabled = !doorsOpen
      }
    }
  }

  const updateFloorButtonsDisability = (disabled: boolean) => {
    for (let floor = 1; floor <= 6; floor++) {
      const button = document.getElementById(`btn-${floor}`) as HTMLButtonElement
      if (button) {
        button.disabled = disabled
      }
    }
  }

  const updateStatus = (status: string) => {
    const element = document.getElementById('elevator-status')
    if (element) element.textContent = status
  }

  const updateDoorStatus = (status: string) => {
    const element = document.getElementById('door-status')
    if (element) element.textContent = status
  }

  const updateCurrentFloor = (floor: string) => {
    const element = document.getElementById('current-floor')
    if (element) element.textContent = floor
  }

  const updateButtonStates = (buttonId: string, disabled: boolean) => {
    const button = document.getElementById(buttonId) as HTMLButtonElement
    if (button) button.disabled = disabled
  }

  // 初期化処理
  useEffect(() => {
    updateAllButtonStates()
    // 初期状態はドア開なので、開ボタンは無効、閉ボタンは有効
    const openBtn = document.getElementById('open-btn') as HTMLButtonElement
    const closeBtn = document.getElementById('close-btn') as HTMLButtonElement
    if (openBtn) openBtn.disabled = true
    if (closeBtn) closeBtn.disabled = false
    
    // 初期状態のドア表示
    const elevatorCar = document.getElementById('elevator-car')
    if (elevatorCar) {
      elevatorCar.classList.add('doors-open')
    }
    updateDoorStatus('ドア: 開いています')
  }, [])

  // キュー更新時の処理
  useEffect(() => {
    const queueList = document.getElementById('queue-list')
    if (queueList) {
      if (floorQueue.length === 0) {
        queueList.textContent = 'なし'
      } else {
        queueList.innerHTML = floorQueue.map(floor => 
          `<span class="queue-item">${floor}F</span>`
        ).join('')
      }
    }
  }, [floorQueue])

  // ドア状態変更時の処理
  useEffect(() => {
    updateAllButtonStates()
  }, [doorsOpen, currentFloor, floorQueue])

  return (
    <div className="elevator-container">
      <div className="control-panel">
        <div className="panel-title">操作パネル</div>
        
        {[6, 5, 4, 3, 2, 1].map(floor => (
          <button
            key={floor}
            className={`floor-button ${
              currentFloor === floor ? 'current' :
              floorQueue.includes(floor) ? 'selected' : ''
            }`}
            onClick={() => selectFloor(floor)}
            id={`btn-${floor}`}
            disabled={!doorsOpen}
          >
            {floor}F
          </button>
        ))}
        
        <button className="clear-button" onClick={clearQueue}>
          全解除
        </button>
        
        <div className="door-controls">
          <div className="door-controls-title">ドア操作</div>
          <button
            className="door-button"
            onClick={openDoor}
            id="open-btn"
          >
            ◀|▶<br /><span style={{ fontSize: '12px' }}>開</span>
          </button>
          <button
            className="door-button"
            onClick={closeDoor}
            id="close-btn"
          >
            ▶|◀<br /><span style={{ fontSize: '12px' }}>閉</span>
          </button>
        </div>
      </div>
      
      <div className="elevator-shaft">
        {[6, 5, 4, 3, 2, 1].map((floor) => (
          <div
            key={floor}
            className={`floor-indicator floor-${floor}`}
          >
            {floor}F
          </div>
        ))}
        
        <div className="elevator-car" id="elevator-car">
          <div className="elevator-interior">こんにちは！</div>
          <div className="elevator-door door-left"></div>
          <div className="elevator-door door-right"></div>
        </div>
      </div>
      
      <div className="status-panel">
        <div className="status-title">状態表示</div>
        <div className="current-floor" id="current-floor">1F</div>
        <div className="elevator-status" id="elevator-status">停止中・ドア開</div>
        
        <div className="queue-section">
          <div className="queue-title">行き先リスト</div>
          <div className="queue-list" id="queue-list">なし</div>
        </div>
        
        <div className="status-info">
          <div className="status-text">
            <div id="door-status">ドア: 開いています</div>
            <div className="next-action">
              {!doorsOpen && floorQueue.length > 0 ? 'エレベーターが移動します...' : 
               !doorsOpen ? '階数ボタンはドアが開いている時のみ押せます' : 
               floorQueue.length > 0 ? '「閉」ボタンを押すと移動します' :
               '階数を選択してください'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}