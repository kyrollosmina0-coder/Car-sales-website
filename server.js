const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const publicFolder = path.join(__dirname, "public");
const databaseFile = path.join(__dirname, "db", "database.json");

function readDatabase() {
  const data = fs.readFileSync(databaseFile, "utf8");
  return JSON.parse(data);
}

function writeDatabase(data) {
  fs.writeFileSync(databaseFile, JSON.stringify(data, null, 2));
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
}

function getRequestBody(request, callback) {
  let body = "";
  request.on("data", chunk => {
    body += chunk.toString();
  });
  request.on("end", () => {
    try {
      callback(JSON.parse(body || "{}"));
    } catch (error) {
      callback(null);
    }
  });
}

function serveStaticFile(request, response) {
  let filePath = request.url === "/" ? "/index.html" : request.url;
  filePath = path.join(publicFolder, filePath);

  if (!filePath.startsWith(publicFolder)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png"
  };

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end("File not found");
      return;
    }

    response.writeHead(200, { "Content-Type": contentTypes[ext] || "text/plain" });
    response.end(content);
  });
}

const server = http.createServer((request, response) => {
  if (request.method === "GET" && request.url === "/api/reviews") {
    const database = readDatabase();
    sendJson(response, 200, database.reviews);
    return;
  }

  if (request.method === "POST" && request.url === "/api/purchases") {
    getRequestBody(request, purchase => {
      if (!purchase || !purchase.buyer || !purchase.car) {
        sendJson(response, 400, { message: "Invalid purchase data" });
        return;
      }

      const database = readDatabase();
      database.purchases.push(purchase);
      writeDatabase(database);
      sendJson(response, 200, { message: "Purchase saved in database file" });
    });
    return;
  }

  if (request.method === "POST" && request.url === "/api/reviews") {
    getRequestBody(request, review => {
      if (!review || !review.name || !review.car || !review.comment) {
        sendJson(response, 400, { message: "Invalid review data" });
        return;
      }

      const database = readDatabase();
      database.reviews.push(review);
      writeDatabase(database);
      sendJson(response, 200, { message: "Review saved in database file" });
    });
    return;
  }

  serveStaticFile(request, response);
});

server.listen(PORT, () => {
  console.log(`Project running at http://localhost:${PORT}`);
});
