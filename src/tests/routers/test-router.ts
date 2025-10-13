import { Router } from "express";
import { testRepository } from "../repositories/test-repository";
import { STATUSES_CODE } from "../../core/types/constants";

export const testRouter = Router();

// Тестовый роут для очистки всех данных
testRouter.delete("", async (req, res) => {
  await testRepository.clearAll();

  res.sendStatus(STATUSES_CODE.NoContent);
});
