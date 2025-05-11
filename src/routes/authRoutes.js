const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.loginPage);
router.post('/login', authController.loginHandle);

router.get('/register', authController.registerPage);
router.post('/register', authController.registerHandle);

router.get('/code', authController.codePage);
router.post('/code', authController.codeHandle);

router.get('/reset', authController.resetPage);
router.post('/reset', authController.resetHandle);

module.exports = router;