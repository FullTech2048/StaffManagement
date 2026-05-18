const app = require("./app");
const { port } = require("./config/env");

app.listen(port, () => {
  console.log(`Staff Management API listening on port ${port}`);
});
