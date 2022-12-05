const http = require("http");
const port = process.env.PORT;
const server = http.createServer((req, res) => {
  console.log("hit");
  res.end("<h1>hi</h1>");
});
server.listen(port, console.log("listening to " + port));
