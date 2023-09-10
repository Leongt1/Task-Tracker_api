const usersDB = {
	users: require("../models/users.json"),
	setUsers: function (data) {
		this.users = data;
	},
};
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
	// on client, also delete the accessToken

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); //no content
	const refreshToken = cookies.jwt;

	// is refreshToken in db
  // if cookie is found but the user with the same cookie refreshToken is not found 
	const foundUser = usersDB.users.find(
		(person) => person.refreshToken === refreshToken
	);
	// console.log(foundUser)
  
	if (!foundUser) {
		res.clearCookie("jwt", {
			httpOnly: true,
			sameSite: 'None',
			secure: true,
		});
		return res.sendStatus(204);
	} //forbidden

  // if cookie is found and the corresponding user
	// delete the refreshToken from db
	const otherUsers = usersDB.users.filter(
		(person) => person.refreshToken !== foundUser.refreshToken
	);
	const currentUser = { ...foundUser, refreshToken: "" };
	usersDB.setUsers([...otherUsers, currentUser]);
	await fsPromises.writeFile(
		path.join(__dirname, "..", "models", "users.json"),
		JSON.stringify(usersDB.users)
	);

	res.clearCookie("jwt", { 
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });

  res.status(204).json({'logged out user': currentUser.username});
};

module.exports = {
	handleLogout: handleLogout,
};
