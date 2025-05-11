const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isNotAuthenticated } = require('../utils/authorizationCheck');

router.get('/login', isNotAuthenticated, authController.loginPage);
router.post('/login', isNotAuthenticated, authController.loginHandle);

router.get('/register', isNotAuthenticated, authController.registerPage);
router.post('/register', isNotAuthenticated, authController.registerHandle);

router.get('/code', isNotAuthenticated, authController.codePage);
router.post('/code', isNotAuthenticated, authController.codeHandle);

router.get('/reset', isNotAuthenticated, authController.resetPage);
router.post('/reset', isNotAuthenticated, authController.resetHandle);

module.exports = router;