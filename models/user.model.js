// const bcrypt = require(bcrypt);

const userDB = {
  users: require('../models/users.json'),
  setUsers: function (data) { this.users = data}
}

const { authDb }= require("../config/database");

class User {
  constructor(username, roles, password, refreshToken, id) {
    this.username = username;
    this.roles = roles;
    this.password = password;
    this.refreshToken = refreshToken;
    if(id) {
      this.id = id;
    }
  }

  static getAllUsers = async() => {
    const userDocuments = await authDb.collection('users').find({}).toArray();
    return userDocuments.map(userDocument => {
      return new User(
        userDocument.username,
        userDocument.roles,
        userDocument.password,
        userDocument.refreshToken,
        userDocument._id
      )
    })
  }

  addUser = () => {
    const userData = {
      username: this.username,
      roles: this.roles,
      password: this.password,
      refreshToken: this.refreshToken
    }
    return authDb.collection('users').insertOne(userData);
  }
}

module.exports = User;