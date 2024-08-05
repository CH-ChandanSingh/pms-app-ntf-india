import { Router } from "express";
import { getCostSheetList } from "../controllers/costSheetList.controller.js";

const costSheetListRouter = Router();
costSheetListRouter.get("/", getCostSheetList);
export default costSheetListRouter;
