import "dotenv/config";
import { mock } from "jest-mock-extended";
import AuthenticateUserService from "../../../src/services/AuthenticateUserService";
import BadRequestError from "../../../src/errors/BadRequestError";
import jwt from "jsonwebtoken";
import IJwt from "../../../src/interfaces/IJson";
import UnathorizedError from "../../../src/errors/UnauthorizedError";
import bcrypt from "bcryptjs";
import IGetUserEmailRepository from "../../../src/interfaces/IGetUserEmailRepository";

const makeSut = () => {
  const getUserEmailRepository = mock<IGetUserEmailRepository>();

  const sut: AuthenticateUserService = new AuthenticateUserService(
    getUserEmailRepository
  );

  return { sut, getUserEmailRepository };
};

describe("authenticate user service", () => {
  describe("when execute is called", () => {
    it("should return exception if user isnt registered", async () => {
      const { sut, getUserEmailRepository } = makeSut();

      const userData = {
        email: "useremail@mail.com",
        password: "123123123",
      };

      getUserEmailRepository.execute.mockResolvedValueOnce(null);

      expect(async () => {
        await sut.execute(userData.email, userData.password);
      }).rejects.toThrow(new BadRequestError("Usuario não registrado!"));
    });

    it("should return exception if password isnt matching", async () => {
      const { sut, getUserEmailRepository } = makeSut();

      const userData = {
        email: "useremail@mail.com",
        password: "123123123",
      };

      getUserEmailRepository.execute.mockResolvedValueOnce({
        id: 1,
        email: "useremail@mail.com",
        password: "789789789",
        name: "user name",
        bornAt: "01/09/2001",
        admin: false,
      });

      expect(async () => {
        await sut.execute(userData.email, userData.password);
      }).rejects.toThrow(new UnathorizedError("Falha na autenticação!"));
    });

    it("should return a token if user is registered", async () => {
      const { sut, getUserEmailRepository } = makeSut();

      getUserEmailRepository.execute.mockResolvedValueOnce({
        id: 1,
        email: "useremail@mail.com",
        password: bcrypt.hashSync("123123123"),
        name: "user name",
        bornAt: "01/09/2001",
        admin: false,
      });

      const token = await sut.execute("useremail@mail.com", "123123123");

      const compareToken = jwt.verify(
        token,
        process.env.JWT_TOKEN_SECRET as string
      ) as IJwt;

      expect(compareToken).toHaveProperty("id");

      expect(compareToken.admin).toBe(false);
    });
  });
});
