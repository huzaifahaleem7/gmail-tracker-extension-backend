import { Router } from "express";
import {
  createEmailId,
  handlePixelHit,
  getStatus
} from "../controllers/email.controller.js";

const router = Router();

// Create Email ID
router.route("/create").post(createEmailId);

// Handle pixel hit (this is triggered by the email image)
router.route("/pixel").get(handlePixelHit);

// Get email open status
router.route("/status/:emailId").get(getStatus);

export default router;
