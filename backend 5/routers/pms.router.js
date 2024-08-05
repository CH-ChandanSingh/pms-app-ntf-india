import { Router } from "express";
import { getPms } from "../controllers/pms.controller.js";

const pmsRouter = Router();

pmsRouter.get("/", getPms);

export default pmsRouter;
