import { Router } from "express";
import container from "@/configs/container.config";
import { TYPES } from "@/types/types";
import { IInteractionController } from "@/interfaces/controller.interface";
const router = Router();
const interactionController = container.get<IInteractionController>(TYPES.InteractionController);
router.get("/user/blog/:blogId", interactionController.getUserInteractions);
export default router;
