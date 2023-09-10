const router = require('express').Router();

const signupController = require('../controllers/signup.controller');

router.route('/')
  .post(signupController.handleNewUser);
  // .get(userController.getAllUsers)
  // .post(userController.handleNewUser);

module.exports = router;