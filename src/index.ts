import express from "express";
import { errorMiddleWare } from "./api/middleware.js";

const app = express();
const PORT = 8080;

app.use(express.json());

app.use(errorMiddleWare);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
