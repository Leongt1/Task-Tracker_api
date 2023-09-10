const router = require('express').Router();

const taskController = require('../controllers/task.controller');
const ROLES_LIST = require('../config/rolesList');
const verifyRoles = require('../middlewares/verifyRoles');

router.route('/')
  .get(taskController.getAllTasks)
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), taskController.addTask);

router.route('/:id')
  .get(taskController.getTask)
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), taskController.updateTask)
  .delete(verifyRoles(ROLES_LIST.Admin),taskController.deleteTask);

module.exports = router;