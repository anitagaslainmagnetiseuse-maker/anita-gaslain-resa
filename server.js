import http from "node:http";

const PORT = Number(process.env.PORT || 10000);

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: "ok",
      service: "Anita Gaslain PayPal Checkout",
      payments: "not-configured"
    }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Route indisponible" }));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("Serveur Anita Gaslain demarre");
});
