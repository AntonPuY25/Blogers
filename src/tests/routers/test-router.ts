import {Router} from "express";
import {testRepository} from "../repositories/test-repository";

export const testRouter = Router();

// Тестовый роут для очистки всех данных
testRouter.delete("", async (req, res) => {
    await testRepository.clearAll();

    res.sendStatus(204);
});