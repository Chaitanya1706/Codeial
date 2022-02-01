const express = require('express');
const passport = require('passport');
const router = express.Router();
const usersController = require('../controllers/users_controller');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);


router.get('/signup',usersController.signup);

router.post('/create',usersController.create);

router.get('/signin',usersController.signin);

//use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',    // strategy used
    {failureRedirect : '/user/signin'}
),usersController.createSession);

router.get('/sign-out',usersController.destroySession)

router.get('/forgot_password',usersController.forgotPassword);
router.post('/forgot_password',usersController.resetPassword);

router.get('/reset_password',usersController.setPassword);
router.post('/reset_password',usersController.changePassword);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile','email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/user/signin'}), usersController.createSession);


module.exports = router;