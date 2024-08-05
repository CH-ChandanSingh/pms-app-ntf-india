import { Router } from "express";
import pmsRouter from "./routers/pms.router.js";
import costSheetListRouter from "./routers/costSheetList.router.js";
import rmMovementListRouter from "./routers/rmMovementList.router.js";
import actualPriceListRouter from "./routers/actualPriceList.router.js";
import rmMovementRouter from "./routers/rmMovement.router.js";
import costSheetRouter from "./routers/costSheet.router.js";
import actualPriceRouter from "./routers/actualPrice.router.js";

const router = Router();

router.use(["/pms"], pmsRouter);
router.use(["/rmMovement"], rmMovementRouter);
router.use(["/costSheet"], costSheetRouter);
router.use(["/actualPrice"], actualPriceRouter);
router.use(["/costSheetList"], costSheetListRouter);
router.use(["/rmMovementList"], rmMovementListRouter);
router.use(["/actualPriceList"], actualPriceListRouter);

export default router;
