import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { PORT } from "./constant";

const server = http.createServer();

server.listen(PORT, function() {
  console.log("Server is listening on PORT: ", PORT);
});