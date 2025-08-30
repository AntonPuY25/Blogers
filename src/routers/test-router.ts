import {Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {testRepository} from "../repositories/test-repository";

export const testRouter = Router();

// Тестовый роут для очистки всех данных
testRouter.delete("", (req, res) => {
    testRepository.clearAll();

    res.sendStatus(204);
});