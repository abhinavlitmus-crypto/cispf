const jwt = require('jsonwebtoken');
const HttpStatus = require('http-status-codes');
const Response = require('../../utilities/Response');
const Message = require('../../utilities/Message');
const config = require('../../config');
const userModel = require('../../models/user');
const { Types } = require('mongoose');

module.exports = {

	setCuserInfo: async function (req, res, next) {
		try {
			const bearer = req.headers.authorization.split(" ");
			const token = bearer[1];
			const decode = jwt.verify(token, config.jwt.secretKey);

			const cuser = await userModel.findOne({ _id: decode.sub, isDeleted: false });
			req.__cuser = cuser;
			req.query.ln = cuser?.preferredLn || 'en';
		} catch (e) { } finally {
			next();
		}
	},

	validateToken: async function (req, res, next) {
		try {

			if (req.headers.authorization) {
				const authorization = req.headers.authorization.trim();

				if (authorization.startsWith('Bearer ')) {
					const bearer = req.headers.authorization.split(" ");
					const token = bearer[1];
					const decode = jwt.verify(token, config.jwt.secretKey);

					try {

						const cuser = await userModel.findOne({ _id: decode.sub, isDeleted: false });
						if (!cuser) {
							throw new Error();
						} else if (!cuser.status) {
							Response.fail(res, 'Account is blocked. Contact Admin!!', HttpStatus.StatusCodes.UNAUTHORIZED);
							return;
						} else if (cuser.isDeactivate) {
							Response.fail(res, 'You have deactivated your account. Can not login again.', HttpStatus.StatusCodes.UNAUTHORIZED);
							return;
						}
						req.__cuser = cuser?._doc;
					} catch (e) {
						throw new Error();
					}

					next();
				} else {
					throw Response.createError(Message.invalidToken);
				}
			} else {
				throw new Error();
			}

		} catch (e) {
			console.log(e)
			Response.fail(res, 'Unauthorized! Try login again.', HttpStatus.StatusCodes.UNAUTHORIZED);
		}
	},

	validateTokenWithoutError: async function (req, res, next) {
		try {
			const decode = jwt.verify(req.headers.authorization.split(" ")?.[1], config.jwt.secretKey);
			const cuser = await userModel.findOne({ _id: decode.sub, isDeleted: false });
			req.__cuser = cuser?._doc;
		} catch (e) {
		} finally {
			next()
		}
	},

	restrictGuest: async function (req, res, next) {
		try {
			if (req.headers.authorization && req.headers.authorization.split(" ")[1] != 'undefined') {
				const authorization = req.headers.authorization.trim();

				if (authorization.startsWith('Bearer ')) {
					const bearer = req.headers.authorization.split(" ");
					const token = bearer[1];
					const decode = jwt.verify(token, config.jwt.secretKey);
					try {
						
						const cuser = await userModel.findOne({ _id: decode.sub, isDeleted: false });
						if (!cuser) {
							throw new Error();
						} else if (cuser.type === 'guest') {
							Response.fail(res, 'Unauthorized! Try login again.', HttpStatus.StatusCodes.UNAUTHORIZED);
							return;
						}
					} catch (e) {
						throw new Error();
					}
					next();

				} else {
					throw Response.createError(Message.invalidToken);
				}
			} else {
				throw new Error();
			}

		} catch (e) {
			Response.fail(res, 'Unauthorized! Try login again.', HttpStatus.StatusCodes.UNAUTHORIZED);
		}
	},

	validateSocketUser: async (socket, next) => {
		const token = socket.handshake.headers.token;

		if (token) {
			try {
				const decode = jwt.verify(token, config.jwt.secretKey);
				const cuser = await userModel.findOne({ _id: decode.sub, isDeleted: false, isDeactivate: false });
				if (!cuser) {
					throw new Error();
				} else if (!cuser.status) {
					next(new Error('Account is blocked. Contact Admin!!'));
					return;
				} else if (cuser.isDeactivate) {
					next(new Error('You have deactivated your account. Can not login again.'));
				}
				socket.__cuser = { ...cuser?._doc, isPremiumUser: false, isBoost: false };
				// Check if the user is matched with receiverId: 
				const receiverId = socket.handshake.headers.receiverid;
				socket.__cuser = {
					...socket.__cuser,
					isMatched: Boolean(isMatch?._id),
				}
				next();

			} catch (e) {
				next(new Error('Please Login to continue.'));

			}

		} else {
			next(new Error(Message.invalidToken));
		}
	},
	checkPlanPurchased: async (req, res, next) => {
		try {
			if (req.__cuser.userPlanFeatures) {
				next();
			} else {
				throw new Error();
			}
		} catch (e) {
			Response.fail(res, Message.planNotPurchased.message, HttpStatus.StatusCodes.UNAUTHORIZED);
		}
	},
	
};