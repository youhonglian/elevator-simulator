export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  STOP = 'STOP',
}

export type DirectionType = keyof typeof Direction

export enum DoorState {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}

export type RequestDirection = Exclude<DirectionType, Direction.STOP>

export interface Request {
  floor: number
  direction: DirectionType
  requestType?: RequestDirection
}

export class ElevatorSystem {
  totalFloors: number
  currentFloor: number
  direction: Direction
  isDoorOpen: boolean
  isMoving: boolean
  targetFloors: number[]
  externalUpFloors: Set<number>
  externalDownFloors: Set<number>
  clickedFloors: Set<number>

  constructor() {
    this.totalFloors = 10
    this.currentFloor = 1
    this.direction = Direction.STOP
    this.isDoorOpen = false
    this.isMoving = false
    this.targetFloors = []
    this.externalUpFloors = new Set()
    this.externalDownFloors = new Set()
    this.clickedFloors = new Set()
  }

  removeExternalUpFloor(floor: number) {
    if (this.externalUpFloors.has(floor)) {
      this.externalUpFloors.delete(floor)
    }
  }
  removeExternalDownFloor(floor: number) {
    if (this.externalDownFloors.has(floor)) {
      this.externalDownFloors.delete(floor)
    }
  }
  updateTargetFloor(floor: number) {
    this.targetFloors.push(floor)
  }
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
  }

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
  }
  handleOpenDoor(time: number) {
    if (this.isMoving || this.isDoorOpen) {
      return
    }

    this.isDoorOpen = true
    setTimeout(() => {
      this.isDoorOpen = false
      this.handleCloseDoor()
    }, time)
  }

  addInternalRequest(index: number) {
    if (index == this.currentFloor && this.isMoving == false) {
      this.handleOpenDoor(200)
      return
    }
    if (this.clickedFloors.has(index)) {
      return
    }
    this.clickedFloors.add(index)
    this.targetFloors.push(index)
  }

  addExternalRequest(request: Request, id?: NodeJS.Timeout) {
    const { floor, direction } = request

    if (direction === Direction.UP) {
      this.externalUpFloors.add(floor)
    }

    if (direction === Direction.DOWN) {
      this.externalDownFloors.add(floor)
    }

    // Still and just in the current level
    if (this.direction === Direction.STOP && this.currentFloor === floor) {
      if (direction === Direction.UP) {
        this.removeExternalUpFloor(floor)
      } else {
        this.removeExternalDownFloor(floor)
      }
      clearInterval(id)

      this.handleOpenDoor(200)
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
  }

  updateElevatorStatus() {
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
      this.clickedFloors.delete(this.currentFloor)
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
      this.handleOpenDoor(200)
    }
  }
}

module.exports = { ElevatorSystem }
