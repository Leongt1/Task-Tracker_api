const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
	const { user, pwd } = req.body;
	if (!user || !pwd)
		return res.status(400).json({ message: "Username and password required!" });

	const foundUser = await User.getUserByUsername(user);
	// console.log(foundUser)
	if (!foundUser) return res.sendStatus(401); //unauthorized

	// evaluate password
	const match = await bcrypt.compare(pwd, foundUser.password);
	if (match) {
		const roles = Object.values(foundUser.roles);
		
		// create JWTs
		const accessToken = jwt.sign(
			{ 
				'UserInfo': {
					'username': foundUser.username,
					'roles': roles
				}
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "30s" }
		);
		const refreshToken = jwt.sign(
			{ username: foundUser.username },
			process.env.REFRESH_TOKEN_SECRET,
			{ expiresIn: "1d" }
		);

		//saving refreshToken with currrent users
		foundUser.refreshToken = refreshToken;
		// console.log(foundUser);
		const loginUser = new User(
			foundUser.username, 
			foundUser.password,
			foundUser.roles, 
			foundUser.refreshToken
		);
		// console.log(loginUser);
		const result = await loginUser.login();
		console.log(result);

		res.cookie("jwt", refreshToken, {
			httpOnly: true,
			sameSite: 'None',
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		});
		
		res.status(201).json({ accessToken });
	} else {
		res.sendStatus(401);
	}
};

module.exports = {
	handleLogin: handleLogin,
};
