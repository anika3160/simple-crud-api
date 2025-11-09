import http from "http";

export const sendResponse = (
  res: http.ServerResponse,
  statusCode: number,
  contentType: string,
  data?: unknown,
): void => {
  console.log(`Response status: ${statusCode}`);
  res.writeHead(statusCode, {
    "Content-Type": contentType,
  });
  if (data) {
    res.write(typeof data === "string" ? data : JSON.stringify(data));
  }
  res.end();
};

export const readJsonData = (req: http.IncomingMessage): Promise<any> =>
  new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        const parsedData = data ? JSON.parse(data) : undefined;
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    });
  });
