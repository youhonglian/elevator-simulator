import type { Request, DoorStateType } from '@/types/index.ts'
import useElevatorStore from '@/stores/elevator'

export async function callElevator(call: Request) {
  try {
    const response = await fetch('/api/elevator/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        floor: Number(call.floor),
        direction: call.direction,
        requestType: call.requestType,
      }),
    })

    const result = await response.json()
    if (response.ok) {
      return result
    } else {
      console.error('Failed request:', result.error)
    }
  } catch (error) {
    console.error('Failed request:', error)
  }
}

export async function getElevatorStatus() {
  try {
    const response = await fetch('/api/elevator/status')
    const status = await response.json()

    useElevatorStore().updateStatus(status)

    return response
  } catch (error) {
    console.error('Failed to get status:', error)
  }
}

export async function updateDoorAction(action: DoorStateType) {
  try {
    const response = await fetch('/api/elevator/door', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
      }),
    })

    const result = await response.json()
    if (response.ok) {
      return result
    } else {
      console.error('Failed request:', result.error)
    }
  } catch (error) {
    console.error('Failed request:', error)
  }
}
