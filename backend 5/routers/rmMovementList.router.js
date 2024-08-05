import { Router } from "express";
import { getRmMovementList } from "../controllers/rmMovementList.controller.js";

const rmMovementListRouter = Router();
rmMovementListRouter.get("/", getRmMovementList);
export default rmMovementListRouter;
