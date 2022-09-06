import recordController from "@controllers/record.controller";
import { Router } from "express";

const router = Router();

router.get("/", recordController.getRowsData);
router.post("/next", recordController.addNextRow);
router.post("/child", recordController.addChildRow);
router.put("/", recordController.editRow);
router.put("/move/next", recordController.moveRowAsNext);
router.put("/move/child", recordController.moveRowAsChild);
router.delete("/", recordController.deleteRow);

export default router;