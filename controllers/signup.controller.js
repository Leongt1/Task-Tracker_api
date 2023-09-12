const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const handleNewUser = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd)
		return res
			.status(404)
			.json({ message: "username and password are required!" });

	const duplicate = await User.getUserByUsername(user);
	if (duplicate) return res.sendStatus(409);

	//encrypt the pwd
  const hashedPwd = await bcrypt.hash(pwd, 10);
  
  const newUser = new User(user, hashedPwd);
	try {
		//store the new user
		const result = await newUser.signup();
    console.log(result);
    res.status(201).json({ success: `New user ${user} created!` });
		
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = {
	handleNewUser: handleNewUser,
};
