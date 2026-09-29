const express = require('express');
const router = express.Router();
const garage = require('../controllers/garageController');

// All routes here are mounted at /garage and require a signed-in user

// ----- Cars (full CRUD) -----

// Index: list the signed-in user's cars
router.get('/', garage.index);

// New: show the "add a car" form
router.get('/new', garage.newCar);

// Create: save a new car
router.post('/', garage.createCar);

// Show: one car with its fault history table
router.get('/:id', garage.showCar);

// Edit: show the edit form for one car
router.get('/:id/edit', garage.editCar);

// Update: save changes to a car
router.put('/:id', garage.updateCar);

// Delete: remove a car and all its code logs
router.delete('/:id', garage.deleteCar);

// ----- Code logs for one car -----

// Create: log a new DTC for this car
router.post('/:id/logs', garage.addLog);

// Update: change a log's repair status (Open / In Progress / Resolved) or note
router.put('/:id/logs/:logId', garage.updateLog);

// Delete: remove one log
router.delete('/:id/logs/:logId', garage.deleteLog);

module.exports = router;
