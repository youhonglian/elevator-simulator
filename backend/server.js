"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var elevatorSystem_1 = require("./elevatorSystem");
var RequestSource;
(function (RequestSource) {
    RequestSource["INTERNAL"] = "INTERNAL";
    RequestSource["EXTERNAL"] = "EXTERNAL";
})(RequestSource || (RequestSource = {}));
var ActionSource;
(function (ActionSource) {
    ActionSource["OPEN"] = "OPEN";
    ActionSource["CLOSE"] = "CLOSE";
})(ActionSource || (ActionSource = {}));
var app = (0, express_1.default)();
var PORT = 3000;
app.use(body_parser_1.default.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
var elevatorSystem = new elevatorSystem_1.ElevatorSystem();
app.post('/elevator/requests', function (req, res) {
    try {
        var _a = req.body, floor = _a.floor, direction = _a.direction, requestType = _a.requestType;
        if (requestType === RequestSource.EXTERNAL) {
            elevatorSystem.addExternalRequest({ floor: floor, direction: direction });
        }
        if (requestType === RequestSource.INTERNAL) {
            elevatorSystem.addInternalRequest(floor);
        }
        res.json({
            currentFloor: elevatorSystem.currentFloor,
            direction: elevatorSystem.direction,
        });
    }
    catch (error) {
        var e = error;
        res.status(500).json({ error: e.message });
    }
});
app.patch('/elevator/door', function (req, res) {
    var action = req.body.action;
    if (action === ActionSource.OPEN) {
        elevatorSystem.handleOpenDoor(200);
    }
    if (action === ActionSource.CLOSE) {
        elevatorSystem.handleCloseDoor();
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
    });
});
app.get('/elevator/status', function (req, res) {
    elevatorSystem.updateElevatorStatus();
    res.json({
        currentFloor: elevatorSystem.currentFloor,
        direction: elevatorSystem.direction,
        isMoving: elevatorSystem.isMoving,
        isDoorOpen: elevatorSystem.isDoorOpen,
        targetFloors: elevatorSystem.targetFloors,
        externalUpFloors: Array.from(elevatorSystem.externalUpFloors),
        externalDownFloors: Array.from(elevatorSystem.externalDownFloors),
        clickedFloors: Array.from(elevatorSystem.clickedFloors),
    });
});
app.use(function (err, req, res, next) {
    var status = err.status || 500;
    res.status(status).json({
        error: {
            message: err.message,
            status: status,
        },
    });
});
app.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
