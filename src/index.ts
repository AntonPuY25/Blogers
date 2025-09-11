import express from "express";
import { setupApp } from "./app";
import { runDb } from "./db/db";

// создание приложения
const app = express();
setupApp(app);

// порт приложения
const PORT = process.env.PORT || 3000;

// запуск приложения
app.listen(PORT, async () => {


  await runDb();

  console.log(`Example app listening on port ${PORT}`);
});
