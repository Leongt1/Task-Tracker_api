require('dotenv').config();
const {MongoClient} = require('mongodb');

const tasksDBUrl = process.env.TASKDB_URI;
// const tasksDBUrl = 'mongodb://127.0.0.1:27017/task-traker-api';
const authDBUrl = process.env.AUTHDB_URI;
// const authDBUrl = 'mongodb://127.0.0.1:27017/auth-user-api';

const tasksClient = new MongoClient(tasksDBUrl);
const authClient = new MongoClient(authDBUrl);

const initDb = async() => {
  try {
    await tasksClient.connect();
    await authClient.connect();
    console.log('connected to dbs successfully!')
  } catch(err) {
    return err.message;
  }
};

module.exports = {
  initDb: initDb,
  authDb: authClient.db(),
  tasksDb: tasksClient.db(),
};