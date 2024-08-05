import { Router } from "express";
import { getActualPrice } from "../controllers/actualPrice.controller.js";

const actualPriceRouter = Router();
actualPriceRouter.post("/", getActualPrice);
export default actualPriceRouter;
