import { Router } from "express";
import { conversationController } from '@/controllers';

const router = Router();

router.post("/", conversationController.create);
router.get("/:conversationId", conversationController.resume);

export default router;
