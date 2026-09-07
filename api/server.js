const app = require("./src/app");
const config = require("./src/config");
const Logger = require("./src/utilities/Logger");

const port = config.port || 8500;

app.listen(port, () => {
  console.log("Server running on ",port)
  // Logger.log(
  //   "info",
  //   `
  //   ################################################
  //   🛡  Server listening on port: ${port} 🛡
  //   ################################################
  //   `
  // );
});