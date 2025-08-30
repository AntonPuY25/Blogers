import request from "supertest";
import express from "express";
import {setupApp} from "../src/app";

describe("Blogs tests", () => {
    const app = express();

    setupApp(app);


    // beforeAll(async () => {
    //     await request(app).delete("/testing/all-data").expect(204);
    // });


    it(`should get all blogs'`, async () => {

        const getBlogs = await request(app)
            .get("/blogs")
            .expect(200);

        expect(Array.isArray(getBlogs.body)).toBeTruthy();

    });

});