import { Router } from "express";
import { getRmMovement } from "../controllers/rmMovement.controller.js";

const rmMovementRouter = Router();
rmMovementRouter.post("/", getRmMovement);
export default rmMovementRouter;
