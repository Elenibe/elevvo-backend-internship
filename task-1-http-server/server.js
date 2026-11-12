const http = require("http");
const os = require("os");

const PORT = 3000;


const users = [
  { id: 1, name: "Abebe Kebede", email: "abebe@example.com" },
  { id: 2, name: "Selam Tesfaye", email: "selam@example.com" },
  { id: 3, name: "Dawit Alemu", email: "dawit@example.com" },
];


function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;

  console.log(`${method} ${pathname}`);

  if (method === "GET" && pathname === "/") {
    return sendJson(res, 200, { message: "Welcome to my raw HTTP server" });
  }

  if (method === "GET" && pathname === "/api/users") {
    return sendJson(res, 200, { count: users.length, users });
  }

  //  health check
  if (method === "GET" && pathname === "/api/health") {
    return sendJson(res, 200, {
      status: "ok",
      uptimeSeconds: process.uptime(),
      platform: os.platform(),
      timestamp: new Date().toISOString(),
    });
  }

  
  sendJson(res, 404, { error: "Not Found", path: pathname });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});