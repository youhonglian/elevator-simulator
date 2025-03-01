export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  STOP = 'STOP',
}

export enum DoorState {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}

export type DirectionType = keyof typeof Direction

export type RequestDirection = Exclude<DirectionType, Direction.STOP>

export type DoorStateType = keyof typeof DoorState

export interface ElevatorState {
  id: number
  currentFloor: number
  targetFloors: number[]
  direction: Direction
  doorStatus: DoorStateType
  capacity: number
}

export enum RequestSource {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export type RequestType = keyof typeof RequestSource
export interface Request {
  floor: number
  direction?: RequestDirection
  requestType?: RequestType
}
