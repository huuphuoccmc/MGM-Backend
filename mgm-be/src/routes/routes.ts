import { Router } from "express";
import authRoute from "./auth.route";
import columnRoute from "./column.route";
import recordRoute from "./record.route";
const router = Router();

router.use("/column", columnRoute);
router.use("/record", recordRoute);
router.use("/auth", authRoute);

export default router;
