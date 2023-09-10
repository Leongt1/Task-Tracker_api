const mongoDb = require("mongodb");

const {tasksDb}= require("../config/database");

class Task {
	constructor(title, description, dueDate, priority, taskStatus, id) {
		this.title = title;
		this.description = description;
		this.dueDate = dueDate;
		this.priority = priority;
		this.taskStatus = taskStatus;
    if(id) {
      this.id = id.toString();
    }
	}

	static getAllTasks = async () => {
		const taskDocuments = await tasksDb.collection("tasks").find().toArray();
		return taskDocuments.map((taskDocument) => {
			return new Task(
				taskDocument.title,
				taskDocument.description,
				taskDocument.dueDate,
				taskDocument.priority,
				taskDocument.taskStatus,
				taskDocument._id
			);
		});
	};

  static getTaskById = async (id) => {
    const taskId = new mongoDb.ObjectId(id);
    const task = await tasksDb.collection('tasks').findOne({_id: taskId});
    return task;
  }

	save = async () => {
    const taskData = {
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      taskStatus: this.taskStatus,
    }

    if(this.id) {
      const taskId = new mongoDb.ObjectId(this.id);

      await tasksDb
        .collection('tasks')
        .updateOne({_id: taskId}, {$set: taskData})
    }
    else {
      return tasksDb
        .collection("tasks")
        .insertOne(taskData);
    }
	};

  static delete = async (id) => {
    const taskId = new mongoDb.ObjectId(id);
    const task = await tasksDb.collection('tasks').deleteOne({_id: taskId})
    return task;
  }
}

module.exports = Task;
