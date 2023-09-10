const router = require('express').Router();

const logoutController = require('../controllers/logout.controller');

router.route('/')
  .get(logoutController.handleLogout);

module.exports = router;