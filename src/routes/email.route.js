import { Router } from "express";
import {
  handlePixelHit,
  getStatus,
  sendEmailController
} from "../controllers/email.controller.js";

const router = Router();

// Create Email ID
// router.route("/create").post(createEmailId);

// Handle pixel hit (this is triggered by the email image)
router.route("/track").get(handlePixelHit);
// router.route("/pixel").get(handlePixelHit);

// Get email open status
router.route("/status/:emailId").get(getStatus);

//Send email with tracking pixel
router.route("/send").post(sendEmailController);

export default router;
