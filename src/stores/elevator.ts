import { defineStore } from 'pinia'
import { Direction } from '@/types/index'

interface StateType {
  totalFloors: number
  floorHeight: number
  simulationSpeed: number
  currentFloor: number
  direction: Direction
  isDoorOpen: boolean
  isMoving: boolean
  targetFloors: number[]
  externalUpFloors: Set<number>
  externalDownFloors: Set<number>
  clickedFloors: Set<number>
}

const useElevatorStore = defineStore('elevator', {
  state: (): StateType => ({
    totalFloors: 10,
    floorHeight: 60,
    simulationSpeed: 1,

    isDoorOpen: false,
    isMoving: false,

    direction: Direction.STOP,
    currentFloor: 1,
    targetFloors: [],

    externalUpFloors: new Set(),
    externalDownFloors: new Set(),
    clickedFloors: new Set(),
  }),
  actions: {
    updateStatus(args: Exclude<StateType, 'totalFloors' | 'floorHeight' | 'simulationSpeed'>) {
      const {
        currentFloor,
        direction,
        isMoving,
        isDoorOpen,
        targetFloors,
        externalUpFloors,
        externalDownFloors,
        clickedFloors,
      } = args

      this.currentFloor = currentFloor
      this.direction = direction
      this.isMoving = isMoving
      this.isDoorOpen = isDoorOpen
      this.targetFloors = targetFloors
      this.externalUpFloors = new Set(externalUpFloors)
      this.externalDownFloors = new Set(externalDownFloors)
      this.clickedFloors = new Set(clickedFloors)
    },
  },
})

export default useElevatorStore
