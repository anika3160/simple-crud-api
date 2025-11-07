import dotenv from "dotenv";
import createUsersServer from "./modules/servers/users.js";

dotenv.config();
const PORT: number = Number(process.env.PORT) || 3000;

const server = createUsersServer();
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", (err) => {
  console.log(err);
});
