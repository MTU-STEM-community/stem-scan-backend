const express = require('express');
const { saveMatricNumber, getMatricNumbers } = require('../controllers/matricController');
const router = express.Router();

// Routes
router.post('/matric', saveMatricNumber); // Save matric number
router.get('/matrics', getMatricNumbers); // Get all matric numbers

module.exports = router;
