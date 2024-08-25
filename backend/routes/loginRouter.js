const express = require('express');
const router = express.Router();

const loginController = require('../controllers/LoginController.js');

router.post('/api/login', loginController.login)



module.exports = router;