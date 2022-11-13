import IReq from "./IRequest";
import { Response } from "express";

export default interface IAddPostCommentController {
  handle(req: IReq, res: Response): Promise<Response>;
}
