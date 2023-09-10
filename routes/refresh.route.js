const router = require('express').Router();

const refreshTokenController = require('../controllers/refreshToken.controller');

router.route('/')
  .get(refreshTokenController.handleRefreshToken);
  // .get(userController.getAllUsers)
  // .post(userController.handleNewUser);

module.exports = router;