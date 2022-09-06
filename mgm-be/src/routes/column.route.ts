import { Router } from "express";
import columnController from "@controllers/column.controller";
const router = Router();

router.get("/", columnController.getColumns);
router.post("/", columnController.createColumn);
router.put("/", columnController.editColumn);
router.delete("/", columnController.deleteColumn);

export default router;