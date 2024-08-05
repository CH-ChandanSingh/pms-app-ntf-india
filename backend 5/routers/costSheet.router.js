import { Router } from "express";
import { getCostSheet } from "../controllers/costSheet.controller.js";

const costSheetRouter = Router();
costSheetRouter.post("/", getCostSheet);
export default costSheetRouter;
