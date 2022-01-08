const express = require('express');

const router = express.Router();
const usersController = require('../controllers/users_controller');

router.get('/profile',usersController.profile);


router.get('/signup',usersController.signup);

router.post('/create',usersController.create);

router.get('/signin',usersController.signin);

router.post('/create-session',usersController.createSession);


module.exports = router;