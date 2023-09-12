const { authDb } = require("../config/database");
const DEFAULT_ROLES = { User: 2001, Editor: 0, Admin: 0 };

class User {
	constructor(username, password, roles, refreshToken) {
		this.username = username;
		this.password = password;
		this.roles = roles || DEFAULT_ROLES; // Default roles
		this.refreshToken = refreshToken || null;
	}

	// static getAllUsers = async () => {
	// 	const userDocuments = await authDb.collection("users").find({}).toArray();
	// 	return userDocuments.map((userDocument) => {
	// 		return new User(
	// 			userDocument.username,
	// 			userDocument.password,
	// 			userDocument.roles,
	// 			userDocument.refreshToken,
	// 			userDocument._id
	// 		);
	// 	});
	// };

	static getUserByUsername = async (name) => {
		if (name) {
			const user = await authDb.collection("users").findOne({ username: name });
			return user;
		} else {
			throw new Error("Required valid username!");
		}
	};

	static getUserByRefreshToken = async (token) => {
		if (token) {
			const user = await authDb
				.collection("users")
				.findOne({ refreshToken: token });
			return user;
		} else {
			throw new Error("Required valid token!");
		}
	};

	signup = async () => {
		const newUser = {
			username: this.username,
			password: this.password,
			roles: this.roles,
			refreshToken: this.refreshToken,
		};
		return authDb.collection("users").insertOne(newUser);
	};

	login = async () => {
		if (this.refreshToken !== "" || this.refreshToken !== null || this.refreshToken) {
			const loginUser = await authDb
				.collection("users")
				.updateOne(
					{ username: this.username },
					{ $set: { refreshToken: this.refreshToken } }
				);
			return loginUser;
		} else {
			throw new Error("User already logged in!");
		}
	};

	logout = async () => {
		if (this.refreshToken === "" || this.refreshToken == null || !this.refreshToken) {
			const logoutUser = await authDb
				.collection("users")
				.updateOne(
          { username: this.username },
					{ $set: { refreshToken: this.refreshToken } }
				);
			return logoutUser;
		} else {
			throw new Error("Log in user first to log out!");
		}
	};
}

module.exports = User;
