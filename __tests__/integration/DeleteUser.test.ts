import { jest } from "@jest/globals";
import App from "../../src/app";
import request from "supertest";
import prismaClient from "../../src/database/prismaClient";

describe("delete user", () => {
  beforeAll(async () => {
    await prismaClient.$connect();
  });

  beforeEach(async () => {
    jest.setTimeout(30000);
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("should return an exception if not authenticated", async () => {
    await request(new App().server)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send({
        email: "userdeleted@mail.com.br",
        password: "789789789",
        name: "user name name",
        bornAt: "01/09/2001",
      });

    const response = await request(new App().server).delete(
      "/api/users/delete"
    );

    expect(response.status).toEqual(500);
  });

  it("should delete a user", async () => {
    await request(new App().server)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send({
        email: "userdeleting@mail.com.br",
        password: "123123123",
        name: "user name name",
        bornAt: "01/09/2001",
      });

    const loginRequest = await request(new App().server)
      .post("/api/users/login")
      .set("Accept", "application/json")
      .send({
        email: "userdeleting@mail.com.br",
        password: "123123123",
      });

    const response = await request(new App().server)
      .delete("/api/users/delete")
      .set("Cookie", [loginRequest.headers["set-cookie"]]);

    expect(response.status).toEqual(204);
  });
});
