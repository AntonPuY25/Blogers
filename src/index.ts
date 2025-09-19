import express from "express";
import { setupApp } from "./app";
import { runDb } from "./db/db";
import { SETTINGS } from "./core/settings/settings";

// создание приложения
const app = express();
setupApp(app);

// порт приложения
const PORT = SETTINGS.PORT;

// запуск приложения
app.listen(PORT, async () => {


  await runDb();

  console.log(`Example app listening on port ${PORT}`);
});
