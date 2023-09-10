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
  try {
    const task = await Task.getTaskById(taskId);
    if(task) {
      res.json({
        task: task
      });
    } else {
       res.status(404).json({message: 'Task not found!'});
    }
  } catch (err) {
    return res.status(500).json({message: err.message});
  }
  
}

const updateTask = async(req, res) => {
  const taskId = req.params.id;
  
  let task = await Task.getTaskById(taskId);
  let newTask;
  if(task) {
    newTask = new Task(req.body.title, req.body.description, req.body.dueDate, req.body.priority, req.body.taskStatus, taskId)
  } else {
    res.status(404).json({message: 'id for updating task not found '})
  }
  try{
    // console.log({...req.body});
    await newTask.save();
    res.json({
      updatedTask: newTask
    })
  } catch(err) {
    res.status(500).json({message: 'Error occurred updating task!'})
  }
}

const deleteTask = async(req, res) => {
  const taskId= req.params.id;
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