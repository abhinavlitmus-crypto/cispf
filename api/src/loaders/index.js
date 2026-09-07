const expressLoader = require('./express');
const schedule = require('./schedule');
// const Logger = require('../utilities/Logger');
const mongoose = require('./mongoose');
const socketLoader = require('./socketio');

require('./lodash');

const loader = async function ({ expressApp, server }) {

	 mongoose();
	console.info('✌️ DB loaded and connected!');
	await schedule.init();
	console.info('✌️ Scheduler Running');

	//  socketLoader({ server });
	// console.info('✌️ Socket running');

	 expressLoader({ app: expressApp });
	console.info('✌️ Express loaded');

};

module.exports = loader;