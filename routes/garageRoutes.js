const express = require('express');
const router = express.Router();
const garage = require('../controllers/garageController');

router.get('/', garage.index);

router.get('/new', garage.newCar);

router.post('/', garage.createCar);

router.get('/:id', garage.showCar);

router.get('/:id/edit', garage.editCar);

router.put('/:id', garage.updateCar);

router.delete('/:id', garage.deleteCar);

router.post('/:id/logs', garage.addLog);

router.put('/:id/logs/:logId', garage.updateLog);

router.delete('/:id/logs/:logId', garage.deleteLog);

module.exports = router;
