import http from "http";

const data = JSON.stringify({ email: "user@bookstore.com", password: "user123" });

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/api/auth/login",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = "";
  res.on("data", (chunk) => {
    body += chunk;
  });
  res.on("end", () => {
    console.log(res.statusCode);
    console.log(body);
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.write(data);
req.end();
