"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElevatorSystem = exports.DoorState = exports.Direction = void 0;
var Direction;
(function (Direction) {
    Direction["UP"] = "UP";
    Direction["DOWN"] = "DOWN";
    Direction["STOP"] = "STOP";
})(Direction || (exports.Direction = Direction = {}));
var DoorState;
(function (DoorState) {
    DoorState["OPEN"] = "OPEN";
    DoorState["CLOSE"] = "CLOSE";
})(DoorState || (exports.DoorState = DoorState = {}));
var ElevatorSystem = /** @class */ (function () {
    function ElevatorSystem() {
        this.totalFloors = 10;
        this.currentFloor = 1;
        this.direction = Direction.STOP;
        this.isDoorOpen = false;
        this.isMoving = false;
        this.targetFloors = [];
        this.externalUpFloors = new Set();
        this.externalDownFloors = new Set();
        this.clickedFloors = new Set();
    }
    ElevatorSystem.prototype.removeExternalUpFloor = function (floor) {
        if (this.externalUpFloors.has(floor)) {
            this.externalUpFloors.delete(floor);
        }
    };
    ElevatorSystem.prototype.removeExternalDownFloor = function (floor) {
        if (this.externalDownFloors.has(floor)) {
            this.externalDownFloors.delete(floor);
        }
    };
    ElevatorSystem.prototype.updateTargetFloor = function (floor) {
        this.targetFloors.push(floor);
    };
    ElevatorSystem.prototype.setDirection = function () {
        if (!this.targetFloors.length) {
            this.direction = Direction.STOP;
            return;
        }
        var maxFloor = Math.max.apply(Math, this.targetFloors);
        var minFloor = Math.min.apply(Math, this.targetFloors);
        var currentFloorVal = this.currentFloor;
        if (this.direction === Direction.UP) {
            this.direction = maxFloor > currentFloorVal ? Direction.UP : Direction.DOWN;
        }
        else if (this.direction === Direction.DOWN) {
            this.direction = minFloor < currentFloorVal ? Direction.DOWN : Direction.UP;
        }
    };
    ElevatorSystem.prototype.handleCloseDoor = function () {
        this.setDirection();
        if (this.isMoving || !this.isDoorOpen) {
            return;
        }
        this.isDoorOpen = false;
        if (!this.targetFloors.length) {
            this.isMoving = false;
        }
        else {
            this.isMoving = true;
        }
    };
    ElevatorSystem.prototype.handleOpenDoor = function (time) {
        var _this = this;
        if (this.isMoving || this.isDoorOpen) {
            return;
        }
        this.isDoorOpen = true;
        setTimeout(function () {
            _this.isDoorOpen = false;
            _this.handleCloseDoor();
        }, time);
    };
    ElevatorSystem.prototype.addInternalRequest = function (index) {
        if (index == this.currentFloor && this.isMoving == false) {
            this.handleOpenDoor(200);
            return;
        }
        if (this.clickedFloors.has(index)) {
            return;
        }
        this.clickedFloors.add(index);
        this.targetFloors.push(index);
    };
    ElevatorSystem.prototype.addExternalRequest = function (request, id) {
        var _this = this;
        var floor = request.floor, direction = request.direction;
        if (direction === Direction.UP) {
            this.externalUpFloors.add(floor);
        }
        if (direction === Direction.DOWN) {
            this.externalDownFloors.add(floor);
        }
        // Still and just in the current level
        if (this.direction === Direction.STOP && this.currentFloor === floor) {
            if (direction === Direction.UP) {
                this.removeExternalUpFloor(floor);
            }
            else {
                this.removeExternalDownFloor(floor);
            }
            clearInterval(id);
            this.handleOpenDoor(200);
            return;
        }
        if (this.direction === Direction.STOP && !this.targetFloors.length) {
            this.targetFloors.push(floor);
            clearInterval(id);
            return true;
        }
        // In the same direction and along the way
        if (this.direction === direction) {
            var isSameDirectionAndOnRoute = (direction === Direction.UP && floor > this.currentFloor) ||
                (direction === Direction.DOWN && floor < this.currentFloor);
            if (isSameDirectionAndOnRoute) {
                this.targetFloors.push(floor);
                clearInterval(id);
                return;
            }
        }
        // If the conditions are not met, set 500ms check
        if (!id) {
            var intervalId_1 = setInterval(function () {
                _this.addExternalRequest(request, intervalId_1);
            }, 500);
        }
    };
    ElevatorSystem.prototype.updateElevatorStatus = function () {
        if (this.isDoorOpen) {
            return;
        }
        if (!this.targetFloors.length) {
            this.direction = Direction.STOP;
            this.isMoving = false;
            return;
        }
        else {
            this.isMoving = true;
        }
        if (this.direction !== Direction.STOP) {
            this.currentFloor = this.currentFloor + (this.direction === Direction.UP ? 1 : -1);
        }
        var isArrive = this.targetFloors.indexOf(this.currentFloor);
        if (isArrive == -1) {
            if (this.direction === Direction.STOP) {
                var firstFloorAbs = this.targetFloors[0] - this.currentFloor;
                if (firstFloorAbs > 0) {
                    this.direction = Direction.UP;
                }
                else {
                    this.direction = Direction.DOWN;
                }
            }
        }
        else {
            this.targetFloors.splice(isArrive, 1);
            this.clickedFloors.delete(this.currentFloor);
            this.isMoving = false;
            this.direction = Direction.STOP;
            if (!this.targetFloors.length) {
                this.isMoving = false;
                this.direction = Direction.STOP;
            }
            if (this.direction === Direction.STOP) {
                this.removeExternalUpFloor(this.currentFloor);
                this.removeExternalDownFloor(this.currentFloor);
            }
            else if (this.direction === Direction.UP) {
                this.removeExternalUpFloor(this.currentFloor);
            }
            else if (this.direction === Direction.DOWN) {
                this.removeExternalDownFloor(this.currentFloor);
            }
            this.handleOpenDoor(200);
        }
    };
    return ElevatorSystem;
}());
exports.ElevatorSystem = ElevatorSystem;
module.exports = { ElevatorSystem: ElevatorSystem };
