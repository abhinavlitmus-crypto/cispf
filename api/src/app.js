const express = require('express');
const path = require('path');
require('dotenv/config');
const config = require('./config');
const initLoader = require('./loaders');
const Logger = require('./utilities/Logger');
const compression = require('compression');
global.appRoot = path.resolve(__dirname);


// Logger.init({ level: config.logs.level });
const app = express();
app.use(compression());

// CORS

app.use(require('cors')({ origin: '*' }));

// Static files
app.use(express.static(path.join(__dirname, '..', 'public')));
// Initialize routes, DB, etc. via loaders
(async () => {
  try {
    await initLoader({ expressApp: app });
  } catch (e) {
    console.error('Error during initLoader', e);
  }
})();

module.exports = app;



