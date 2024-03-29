import { jest } from "@jest/globals";
import App from "../../src/app";
import request from "supertest";
import prismaClient from "../../src/database/prismaClient";

describe("list user", () => {
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
        email: "userlisting@mail.com.br",
        password: "789789789",
        name: "user name name",
        bornAt: "01/09/2001",
      });

    const response = await request(new App().server).get(
      "/api/users/user/userlisting@mail.com.br"
    );

    expect(response.status).toEqual(500);
  });

  it("should return an exception if wrong data is send", async () => {
    await request(new App().server)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send({
        email: "userlistingwrong@mail.com.br",
        password: "789789789",
        name: "user name name",
        bornAt: "01/09/2001",
      });

    const login = await request(new App().server)
      .post("/api/users/login")
      .set("Accept", "application/json")
      .send({
        email: "userlistingwrong@mail.com.br",
        password: "789789789",
      });

    const response = await request(new App().server)
      .get("/api/users/user/a@mail.br")
      .set("Cookie", [login.headers["set-cookie"]]);

    expect(response.status).toEqual(400);
  });

  it("should return an exception if searched user is not registered", async () => {
    await request(new App().server)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send({
        email: "userlistedwrong@mail.com.br",
        password: "789789789",
        name: "user name name",
        bornAt: "01/09/2001",
      });

    const login = await request(new App().server)
      .post("/api/users/login")
      .set("Accept", "application/json")
      .send({
        email: "userlistedwrong@mail.com.br",
        password: "789789789",
      });

    const response = await request(new App().server)
      .get("/api/users/user/abcdefghijklmnopqrstuvwxyz@mail.com.br")
      .set("Cookie", [login.headers["set-cookie"]]);

    expect(response.body.status).toEqual(400);
  });

  it("should return a searched user", async () => {
    await request(new App().server)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send({
        email: "searcheduser@mail.com.br",
        password: "789789789",
        name: "user name name",
        bornAt: "01/09/2001",
      });

    await request(new App().server)
      .post("/api/users/register")
      .set("Accept", "application/json")
      .send({
        email: "userseaching@mail.com.br",
        password: "789789789",
        name: "user name name",
        bornAt: "01/09/2001",
      });

    const login = await request(new App().server)
      .post("/api/users/login")
      .set("Accept", "application/json")
      .send({
        email: "userseaching@mail.com.br",
        password: "789789789",
      });

    const response = await request(new App().server)
      .get("/api/users/user/searcheduser@mail.com.br")
      .set("Cookie", [login.headers["set-cookie"]]);

    expect(response.body.status).toEqual(200);

    expect(response.body.user).toHaveProperty("id");
  });
});
