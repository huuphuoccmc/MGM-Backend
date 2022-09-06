import authController from "@controllers/auth.controller";
import { Router } from "express";

const router = Router();
router.get("/", authController.createSession);

export default router;