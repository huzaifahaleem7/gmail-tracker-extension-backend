import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Email } from "../models/email.model.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createEmailId = asyncHandler(async (req, res) => {
    const emailId = crypto.randomUUID()

    const email = await Email.create({
        emailId,
        opened: false,
        openedAt: null
    })
    if (!email){
        throw new ApiError(500, "Failed to create email record");
    }

    return res.status(201).json({
        emailId: email.emailId,
        message: "Email ID created successfully"
    })
})

const handlePixelHit = asyncHandler(async (req, res) => {
  const { emailId } = req.query;

  if (!emailId) {
    throw new ApiError(400, "Email ID is required");
  }

  const email = await Email.findOneAndUpdate(
    { emailId },
    { opened: true, openedAt: new Date() },
    { new: true }
  );

  if (!email) {
    throw new ApiError(404, "Email not found");
  }

  const pixelPath = path.join(__dirname, "../../public/pixel.png");

  return res.sendFile(pixelPath);
});

const getStatus = asyncHandler(async (req, res) => {
    const {emailId} = req.params
    if (!emailId) {
        throw new ApiError(400, "Email ID is required");
    }   
    const email = await Email.findOne({ emailId})
    if (!email){
        throw new ApiError(404, "Email not found");
    }

    return res.status(200).json({
        opened: email.opened,
        openedAt: email.openedAt
    });
})

export { createEmailId, handlePixelHit, getStatus };
