# elevator-simulator

This template should help get you started developing with Vue 3 in Vite.

## Interface display & UI instructions

### Elevator Interior Panel UI Description:

1. ​Top Display Screen​ shows the current status of the elevator:

- ​Direction indicators​ (up/down) are activated when moving. They turn gray when the elevator is stationary at a floor.
​- Floor number​ is displayed in black during movement. It becomes activated (highlighted) when the elevator is stationary at a floor.
- Synchronizes with external floor displays to show real-time status.
​
2. Floor Buttons on the Interior Panel:

- Pressed floor buttons turn ​blue​ and are ​disabled​ until the elevator arrives at the selected floor, opens its doors, and stops.
- Pressing the current floor button while stationary triggers door opening (equivalent to pressing the door-open button).
​- Door-open/close buttons​ are only functional when the elevator is stationary. Movement disables these controls.
- Doors automatically open when the elevator stops at a floo

### External Call Panel UI Description:

1. ​Left Side: Directional Buttons​ (up/down):

- Pressed buttons turn ​blue​ and remain disabled until an elevator traveling in the requested direction stops at the floor.
- If an elevator passes the floor in the opposite direction, it does not stop.
- The ​downward button is disabled on the bottom floor, and the ​upward button is disabled on the top floor.

2. ​Right Side: Display Screen​ shows the elevator’s real-time status:

- ​Direction indicators​ (up/down) are activated during movement and turn gray when the elevator is stationary.
- ​Floor number​ is black during movement and becomes activated (highlighted) when the elevator is stationary at a floor.

### Elevator Internal Scheduling Algorithm Design

  The elevator’s initial direction is determined by the relationship between the first floor added to the task queue and its current floor. Subsequent scheduling defaults to maintaining the current direction until no floors remain in the target queue for that direction, at which point the elevator stops or changes direction.

- If the ​maximum target floor​ in the task queue is ​greater than the current floor, the elevator continues moving ​upward.

- If the ​maximum target floor​ in the task queue is ​less than the current floor, the elevator switches to ​downward​ movement.

- If the task queue is ​empty, the elevator remains ​stationary​ until a new task is added.

### Elevator External Scheduling Algorithm Design

When an external floor call is made:

- ​If the elevator is already stopped at the floor​ and the requested direction matches the elevator’s current direction (or it is stationary), the doors open.

- If the elevator is stopped at the floor​ with no other pending requests, the call is added to the task queue for execution.

- If the call direction matches the elevator’s current direction​ and the elevator has not yet passed the called floor, the call is added to the task queue.

Otherwise, an asynchronous method (setInterval) is invoked to check the elevator’s status ​every 0.5 seconds. Once the elevator meets the criteria, the call is added to the candidate queue, and the timer (clearInterval) stops monitoring.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

### Backend server

```sh
cd backend
# Install deps
npm install
# Compile the typescript file
npm run build
# Start backend server
npm run dev
```

### Frontend setup

```sh
# Install deps
npm install
# Compile and Hot-Reload for Development
npm run dev
# Type-Check, Compile and Minify for Production
npm run build
# Lint with [ESLint](https://eslint.org/)
npm run lint
```
