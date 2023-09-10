const router = require('express').Router();

const loginController = require('../controllers/login.controller');

router.route('/')
  .post(loginController.handleLogin);
  // .get(userController.getAllUsers)
  // .post(userController.handleNewUser);

module.exports = router;