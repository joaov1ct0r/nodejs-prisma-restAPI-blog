import { jest } from "@jest/globals";
import App from "../../src/app";
import request from "supertest";
import prismaClient from "../../src/database/prismaClient";

describe("admin edit user", () => {
  beforeAll(async () => {
    await prismaClient.$connect();
  });

  beforeEach(async () => {
    jest.setTimeout(70000);
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("should return an exception if not authenticated", async () => {
    await request(new App().server)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send({
        email: "admin42838042@mail.com.br",
        password: "789789789",
        name: "user name name",
        bornAt: "01/09/2001",
      });

    const response = await request(new App().server)
      .delete("/api/admin/user/delete")
      .set("Accept", "application/json")
      .send({
        userEmail: "user432840375lksjdlf@mail.com.br",
      });

    expect(response.status).toEqual(500);
  });

  it("should return an exception if not admin", async () => {
    await request(new App().server)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send({
        email: "admi447vkshdk@mail.com.br",
        password: "789789789",
        name: "user name name",
        bornAt: "01/09/2001",
      });

    const login = await request(new App().server)
      .post("/api/users/login")
      .set("Accept", "application/json")
      .send({
        email: "admi447vkshdk@mail.com.br",
        password: "789789789",
      });

    const response = await request(new App().server)
      .delete("/api/admin/user/delete")
      .set("Cookie", [login.headers["set-cookie"]])
      .send({
        userEmail: "user58304vlxjl@mail.com.br",
      });

    expect(response.status).toEqual(401);
  });
});
