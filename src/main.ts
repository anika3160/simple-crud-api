import dotenv from "dotenv";
import createUsersServer from "./servers/users.js";

dotenv.config({ quiet: true });
const PORT: number = Number(process.env.PORT) || 3000;

const server = createUsersServer();
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", (err) => {
  console.log(err);
});
