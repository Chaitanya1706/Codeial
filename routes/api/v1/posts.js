const express = require('express');
const { session } = require('passport');

const router = express.Router();
const passport = require('passport');

const postsApi = require('../../../controllers/api/v1/posts_api');

router.get('/',postsApi.index);

router.delete('/:id',passport.authenticate('jwt', {session : false}),postsApi.destroy);  // making session false so that it doesn't store the session cookies

module.exports = router;