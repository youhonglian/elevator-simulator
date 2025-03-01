import express, { Express, Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import { ElevatorSystem, Request as ElevatorRequest } from './elevatorSystem'

interface ErrorWithStatus extends Error {
  status?: number
}

enum RequestSource {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

enum ActionSource {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}

const app: Express = express()
const PORT = 3000

app.use(bodyParser.json())
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const elevatorSystem = new ElevatorSystem()

app.post('/elevator/requests', (req: Request<{}, {}, ElevatorRequest>, res: Response) => {
  try {
    const { floor, direction, requestType } = req.body
    if (requestType === RequestSource.EXTERNAL) {
      elevatorSystem.addExternalRequest({ floor, direction })
    }
    if (requestType === RequestSource.INTERNAL) {
      elevatorSystem.addInternalRequest(floor)
    }
    res.json({
      currentFloor: elevatorSystem.currentFloor,
      direction: elevatorSystem.direction,
    })
  } catch (error) {
    const e = error as Error
    res.status(500).json({ error: e.message })
  }
})

app.patch('/elevator/door', (req: Request, res: Response) => {
  const { action } = req.body
  if (action === ActionSource.OPEN) {
    elevatorSystem.handleOpenDoor(200)
  }

  if (action === ActionSource.CLOSE) {
    elevatorSystem.handleCloseDoor()
  }

  res.json({
    currentFloor: elevatorSystem.currentFloor,
    direction: elevatorSystem.direction,
    isMoving: elevatorSystem.isMoving,
    isDoorOpen: elevatorSystem.isDoorOpen,
    targetFloors: elevatorSystem.targetFloors,
    externalUpFloors: Array.from(elevatorSystem.externalUpFloors),
    externalDownFloors: Array.from(elevatorSystem.externalDownFloors),
    clickedFloors: Array.from(elevatorSystem.clickedFloors),
  })
})

app.get('/elevator/status', (req: Request, res: Response) => {
  elevatorSystem.updateElevatorStatus()
  res.json({
    currentFloor: elevatorSystem.currentFloor,
    direction: elevatorSystem.direction,
    isMoving: elevatorSystem.isMoving,
    isDoorOpen: elevatorSystem.isDoorOpen,
    targetFloors: elevatorSystem.targetFloors,
    externalUpFloors: Array.from(elevatorSystem.externalUpFloors),
    externalDownFloors: Array.from(elevatorSystem.externalDownFloors),
    clickedFloors: Array.from(elevatorSystem.clickedFloors),
  })
})

app.use((err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500
  res.status(status).json({
    error: {
      message: err.message,
      status,
    },
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
