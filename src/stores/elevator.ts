import { defineStore } from 'pinia'
import type { Request } from '@/types/index'
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
  exteralUpFloors: Set<number>
  exteralDownFloors: Set<number>
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

    exteralUpFloors: new Set(),
    exteralDownFloors: new Set(),
  }),
  actions: {
    removeExternalUpFloor(floor: number) {
      if (this.exteralUpFloors.has(floor)) {
        this.exteralUpFloors.delete(floor)
      }
    },
    removeExternalDownFloor(floor: number) {
      if (this.exteralDownFloors.has(floor)) {
        this.exteralDownFloors.delete(floor)
      }
    },
    setDirection() {
      if (!this.targetFloors.length) {
        this.direction = Direction.STOP
        return
      }

      const maxFloor = Math.max(...this.targetFloors)
      const minFloor = Math.min(...this.targetFloors)

      const currentFloorVal = this.currentFloor

      if (this.direction === Direction.UP) {
        this.direction = maxFloor > currentFloorVal ? Direction.UP : Direction.DOWN
      } else if (this.direction === Direction.DOWN) {
        this.direction = minFloor < currentFloorVal ? Direction.DOWN : Direction.UP
      }
    },
    handleCloseDoor() {
      this.setDirection()

      if (this.isMoving || !this.isDoorOpen) {
        return
      }
      this.isDoorOpen = false

      if (!this.targetFloors.length) {
        this.isMoving = false
      } else {
        this.isMoving = true
      }
    },
    handleOpenDoor(time: number) {
      if (this.isMoving || this.isDoorOpen) {
        return
      }
      setTimeout(() => {
        this.isDoorOpen = true
        setTimeout(() => {
          this.handleCloseDoor()
        }, time)
      }, 1000)
    },

    addExternalRequest(request: Request, id?: number) {
      const { floor, direction } = request

      // Still and just in the current level
      if (this.direction === Direction.STOP && this.currentFloor === floor) {
        if (direction === Direction.UP) {
          this.removeExternalUpFloor(floor)
        } else {
          this.removeExternalDownFloor(floor)
        }
        clearInterval(id)

        this.handleOpenDoor(3000)
        return
      }

      if (this.direction === Direction.STOP && !this.targetFloors.length) {
        this.targetFloors.push(floor)
        clearInterval(id)
        return true
      }

      // In the same direction and along the way
      if (this.direction === direction) {
        const isSameDirectionAndOnRoute =
          (direction === Direction.UP && floor > this.currentFloor) ||
          (direction === Direction.DOWN && floor < this.currentFloor)
        if (isSameDirectionAndOnRoute) {
          this.targetFloors.push(floor)
          clearInterval(id)
          return
        }
      }

      // If the conditions are not met, set 500ms check
      if (!id) {
        const intervalId = setInterval(() => {
          this.addExternalRequest(request, intervalId)
        }, 500)
      }
    },

    updateElevatorStatus(callback?: () => void) {
      if (this.isDoorOpen) {
        return
      }
      if (!this.targetFloors.length) {
        this.direction = Direction.STOP
        this.isMoving = false
        return
      } else {
        this.isMoving = true
      }

      if (this.direction !== Direction.STOP) {
        this.currentFloor = this.currentFloor + (this.direction === Direction.UP ? 1 : -1)
      }

      const isArrive = this.targetFloors.indexOf(this.currentFloor)
      if (isArrive == -1) {
        if (this.direction === Direction.STOP) {
          const firstFloorAbs = this.targetFloors[0] - this.currentFloor
          if (firstFloorAbs > 0) {
            this.direction = Direction.UP
          } else {
            this.direction = Direction.DOWN
          }
        }
      } else {
        this.targetFloors.splice(isArrive, 1)
        callback?.()
        this.isMoving = false
        this.direction = Direction.STOP

        if (!this.targetFloors.length) {
          this.isMoving = false
          this.direction = Direction.STOP
        }

        if (this.direction === Direction.STOP) {
          this.removeExternalUpFloor(this.currentFloor)
          this.removeExternalDownFloor(this.currentFloor)
        } else if (this.direction === Direction.UP) {
          this.removeExternalUpFloor(this.currentFloor)
        } else if (this.direction === Direction.DOWN) {
          this.removeExternalDownFloor(this.currentFloor)
        }
        this.handleOpenDoor(3000)
      }
    },
  },
})

export default useElevatorStore
