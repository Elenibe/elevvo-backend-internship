const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Welcome to my raw HTTP server" }));
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});