const User = require("../models/user.model");

const handleLogout = async (req, res) => {
	// on client, also delete the accessToken

	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); //no content
	const refreshToken = cookies.jwt;
	// console.log(refreshToken);

	// is refreshToken in db?
  // if cookie is found but the user with the same cookie refreshToken is not found 
	const foundUser = await User.getUserByRefreshToken(refreshToken);
	// console.log(foundUser);
  
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
	foundUser.refreshToken = '';
	const logoutUser = new User(
		foundUser.username, 
		foundUser.password,
		foundUser.roles, 
		foundUser.refreshToken
	);
	const result = await logoutUser.logout();
	console.log(result);

	res.clearCookie("jwt", { 
    httpOnly: true,
    sameSite: 'None',
    secure: true,
  });

  return res.status(202).json({'logged out user': logoutUser.username});
};

module.exports = {
	handleLogout: handleLogout,
};
