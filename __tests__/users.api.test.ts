import request from "supertest";
import express from "express";
import { setupApp } from "../src/app";
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from "../src/core/middlewares/auth-middleware";
import { UsersDataForCreateRequest } from "../src/users/routers/types";

describe("Posts tests", () => {
  const app = express();

  setupApp(app);

  // Создаем Basic auth токен
  const basicAuthToken = Buffer.from(
    `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`,
  ).toString("base64");

  beforeAll(async () => {
    await request(app).delete("/testing/all-data").expect(204);
  });

  it(`should create new user'`, async () => {
    const testNewUserData: UsersDataForCreateRequest = {
      login: "Login",
      password: "qwerty123",
      email: "test@mai.ru",
    };

    const createdUser = await request(app)
      .post("/users")
      .set("Authorization", `Basic ${basicAuthToken}`)
      .send(testNewUserData)
      .expect(201);

    expect(createdUser.body.login).toBe(testNewUserData.login);
    expect(createdUser.body.email).toBe(testNewUserData.email);

    await request(app)
      .delete(`/users/${createdUser.body.id}`)
      .set("Authorization", `Basic ${basicAuthToken}`)
      .expect(204);

    const test2NewUserData: UsersDataForCreateRequest = {
      login: "Login2",
      password: "qwerty123",
      email: "test2@mai.ru",
    };

    await request(app)
      .post("/users")
      .set("Authorization", `Basic ${basicAuthToken}`)
      .send(test2NewUserData)
      .expect(201);

    const allUsers = await request(app)
      .get("/users")
      .set("Authorization", `Basic ${basicAuthToken}`);
    expect(200);

    expect(allUsers.body.items?.[0].login).toBe(test2NewUserData.login);
    expect(allUsers.body.items?.[0].email).toBe(test2NewUserData.email);
  });
});
