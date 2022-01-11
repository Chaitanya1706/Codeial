const express = require('express');
const passport = require('passport');
const router = express.Router();
const postsController = require('../controllers/posts_controller');

router.get('/view',postsController.viewPost);

router.post('/create',passport.checkAuthentication, postsController.createPost)

module.exports = router;