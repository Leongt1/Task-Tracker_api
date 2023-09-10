const User = require("../models/user.model");

const usersDB = {
	users: require("../models/users.json"),
	setUsers: function (data) {
		this.users = data;
	},
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd) return res.status(404).json({ message: "username and password are required!" });

  const duplicate = usersDB.users.find(person => {
    person.username === user
  })  
   if(duplicate) res.sendStatus(409);
   try {
    //encrypt the pwd
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //store the new user
    const newUser = {
      'username': user,
      'roles': {
        "User": 2001,
      },
      'password': hashedPwd
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    // writing that data into the json file
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'models', 'users.json'),
      JSON.stringify(usersDB.users)
    );
    
    console.log(usersDB.users);
    res.status(201).json({'success': `New user ${user} created!`})
   }  catch(err) {
    res.status(500).json({'message': err.message})
   }
};

module.exports = {
  handleNewUser: handleNewUser,
}