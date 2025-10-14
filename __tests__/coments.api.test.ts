import request from "supertest";
import express from "express";
import { setupApp } from "../src/app";
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
} from "../src/core/middlewares/auth-middleware";
import { CreateCommentForPostProps } from "../src/posts/routers/interface";
import { CreateBlogType } from "../src/core/types/db-types";
import { UsersDataForCreateRequest } from "../src/users/routers/types";

describe("Comments tests", () => {
  const app = express();

  setupApp(app);

  // Создаем Basic auth токен
  const basicAuthToken = Buffer.from(
    `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`,
  ).toString("base64");

  beforeAll(async () => {
    await request(app).delete("/testing/all-data").expect(204);
  });

  it(`should create new  blog and post for this blog than new comment for post and get all comments for current post'`, async () => {
    const testNewUserData: UsersDataForCreateRequest = {
      login: "Login",
      password: "qwerty123",
      email: "test@mai.ru",
    };

    await request(app)
      .post("/users")
      .set("Authorization", `Basic ${basicAuthToken}`)
      .send(testNewUserData)
      .expect(201);

    const accessToken = await request(app)
      .post("/auth/login")
      .set("Authorization", `Basic ${basicAuthToken}`)
      .send({
        loginOrEmail: testNewUserData.login,
        password: testNewUserData.password,
      });

    const testNewBlogData: CreateBlogType = {
      name: "Blog test",
      description: "Description test",
      websiteUrl: "https://samurai.it-test-incubator.io",
      isMembership: false,
      createdAt: new Date().toISOString(),
    };

    const testNewCommentData: CreateCommentForPostProps = {
      content: "This test content for current comment",
    };

    const createdBlog = await request(app)
      .post("/blogs")
      .set("Authorization", `Basic ${basicAuthToken}`)
      .send(testNewBlogData)
      .expect(201);

    const getCurrentBlog = await request(app)
      .get(`/blogs/${createdBlog.body.id}`)
      .expect(200);

    const testNewPostData = {
      title: "Post test",
      shortDescription: "Description for test post",
      content: "content for test post",
      blogName: getCurrentBlog.body?.name,
      blogId: getCurrentBlog.body?.id,
    };

    const createdPost = await request(app)
      .post("/posts")
      .set("Authorization", `Basic ${basicAuthToken}`)
      .send(testNewPostData)
      .expect(201);

    const createdComment = await request(app)
      .post(`/posts/${createdPost.body.id}/comments`)
      .set("Authorization", `Bearer ${accessToken.body.accessToken}`)
      .send(testNewCommentData)
      .expect(201);

    const currentComment = await request(app).get(
      `/comments/${createdComment.body.id}`,
    );

    expect(createdComment.body.content).toBe(currentComment.body.content);
  });
});
