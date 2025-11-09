import http from "http";

let countOfReq = -1;

const createProxyServer = (PORT: number, numCPUs: number) =>
  http.createServer((clientReq, clientRes) => {
    countOfReq++;
    const port: number = (countOfReq % numCPUs) + PORT + 1;
    console.log("\nRedirect request to port:", port);
    const options = {
      port,
      method: clientReq.method,
      path: clientReq.url,
      headers: {
        ...clientReq.headers,
        host: "127.0.0.1",
      },
    };

    const serverReq = http.request(options, (res) => {
      const statusCode = res.statusCode ?? 500;
      const headers = res.headers ?? {};
      clientRes.writeHead(statusCode, headers);
      res.pipe(clientRes);
    });

    serverReq.on("error", (error) => {
      console.error("Proxy error:", error);
      if (!clientRes.headersSent) {
        clientRes.writeHead(500);
      }
      clientRes.end("Proxy server error");
    });

    clientReq.pipe(serverReq);
  });

export default createProxyServer;
