import User from "../database/models/userModel";

import IEditUserRequest from "../interfaces/IEditUserRequest";

import InternalError from "../errors/InternalError";

import bcrypt from "bcryptjs";

export default class EditUserService {
  async execute({
    email,
    password,
    name,
    bornAt,
    id,
  }: IEditUserRequest): Promise<number> {
    const editedUser: [affectedCount: number] = await User.update(
      {
        email,
        password: bcrypt.hashSync(password),
        name,
        bornAt,
      },
      {
        where: { id },
      }
    );

    if (editedUser[0] === 0) {
      throw new InternalError("Falha ao atualizar usuario!");
    }

    return Number(editedUser);
  }
}
