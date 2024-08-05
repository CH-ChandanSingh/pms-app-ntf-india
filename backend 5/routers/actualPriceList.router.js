import { Router } from "express";
import { getActualPriceList } from "../controllers/actualPriceList.controller.js";

const actualPriceListRouter = Router();
actualPriceListRouter.get("/", getActualPriceList);
export default actualPriceListRouter;
