import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import connection from "./db/index.js";
import app from "./app.js";
import { PORT } from "./constant.js";

connection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serever running at port : ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`DB Connection Failed ${error}`);
  });
