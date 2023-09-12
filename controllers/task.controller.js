const Task = require('../models/task.model');

const getAllTasks = async(req, res) => {
  try {
    const tasks = await Task.getAllTasks();
    res.json({
      tasks: tasks
    });
  } catch(err) {
    res.status(500).json({message: err.message});
  }
  // console.log(tasks);
}

const addTask = async(req, res) => {
  const {title, description, dueDate, priority, taskStatus} = req.body;
  if(!req?.body) {
    return res.status(401).json({'message': "All fields are required!"})
  }
  const task = new Task(title, description, dueDate, priority, taskStatus);
  
  let result;
  try {
    result = await task.save();
    task.id = result.insertedId.toString();
    
    res.json({
      createdTask: task
    })
  } catch(err) {
    res.status(500).json({message: err.message})
  }
}

const getTask = async (req, res) => {
  const taskId = req.params.id;
  if(!taskId) return res.status(401).json({'Invalid TaskID': 'Task not found'})
  try {
    const task = await Task.getTaskById(taskId);
    res.json({
      task: task
    });
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
}

const updateTask = async(req, res) => {
  const taskId = req.params.id;
  if(!taskId) return res.status(401).json({'Invalid TaskID': 'Task not found'})
  let task;
  let newTask;
  try{
    task = await Task.getTaskById(taskId);
    newTask = new Task(req.body.title, req.body.description, req.body.dueDate, req.body.priority, req.body.taskStatus, taskId)
  } catch(err) {
    return res.status(500).json({'TaskId not found': err.message});
  }
  try{
    // console.log({...req.body});
    await newTask.save();
    res.json({
      updatedTask: newTask
    })
  } catch(err) {
    res.status(500).json({'Error occurred updating task!': err.message});
  }
}

const deleteTask = async(req, res) => {
  const taskId= req.params.id;
  if(!taskId) return res.status(401).json({'Invalid TaskID': 'Task not found'})

  try {
    await Task.delete(taskId);
    res.json({
      deletedTaskId: taskId
    })
  } catch(err) {
    res.status(505).json({message: 'Error occured when deleting task'})
  }
}

module.exports = {
  getAllTasks: getAllTasks,
  addTask: addTask,
  getTask: getTask, 
  updateTask: updateTask,
  deleteTask: deleteTask
}