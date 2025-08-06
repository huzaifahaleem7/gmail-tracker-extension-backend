import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Email } from "../models/email.model.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import sendEmailWithPixel from "../utils/senEmail.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pixelImagePath = path.join(__dirname, "..", "..", "public", "track.png");

// const createEmailId = asyncHandler(async (req, res) => {
//     const emailId = crypto.randomUUID()

//     const email = await Email.create({
//         emailId,
//         opened: false,
//         openedAt: null
//     })
//     if (!email){
//         throw new ApiError(500, "Failed to create email record");
//     }

//     return res.status(201).json({
//         emailId: email.emailId,
//         message: "Email ID created successfully"
//     })
// })

// const handlePixelHit = asyncHandler(async (req, res) => {
//   const { emailId } = req.query;

//   // 1. ایمیل ID کی تصدیق کریں (آپ کے Schema کے مطابق)
//   if (!emailId || typeof emailId !== "string") {
//     return res.status(400).send("Invalid email ID");
//   }

//   // 2. ڈیٹابیس میں ای میل ڈھونڈیں
//   const email = await Email.findOne({ emailId });
//   if (!email) {
//     return res.status(404).send("Email not found");
//   }

//   // 3. صرف پہلی بار کھولنے پر اپڈیٹ کریں
//   if (!email.opened) {
//     await Email.updateOne(
//       { emailId }, // آپ کے Schema میں `emailId` یونییک ہے
//       {
//         $set: {
//           opened: true,
//           openedAt: new Date(),
//         },
//       }
//     );
//     console.log(`📬 Email opened: ${emailId}`);
//   }

//   // 4. ٹریکنگ پکسل واپس بھیجیں (1x1 شفاف GIF)
//   res.setHeader("Content-Type", "image/gif");
//   res.setHeader("Cache-Control", "no-store, no-cache");
//   res.send(
//     // Buffer.from("R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==", "base64")
//     pixelImagePath
//   );
// });

const handlePixelHit = asyncHandler(async (req, res) => {
  const { emailId } = req.query;

  // 1. اگر emailId invalid ہے، تب بھی pixel file bhejain
  if (!emailId || typeof emailId !== "string") {
    return res.status(400).sendFile(pixelImagePath);
  }

  // 2. ڈیٹابیس میں ای میل ڈھونڈیں
  const email = await Email.findOne({ emailId });

  // اگر email record nahi mila, to bhi pixel file bhejain (taake browser ko image mile)
  if (!email) {
    return res.status(404).sendFile(pixelImagePath);
  }

  // 3. صرف پہلی بار کھولنے پر اپڈیٹ کریں
  if (!email.opened) {
    await Email.updateOne(
      { emailId },
      {
        $set: {
          opened: true,
          openedAt: new Date(),
        },
      }
    );
    console.log(`📬 Email opened: ${emailId}`);
  }

  // 4. ٹریکنگ پکسل واپس بھیجیں (1x1 شفاف GIF)
  // res.send() ki jagah res.sendFile() istemal karein taake file ka data bheja jaye
  res.sendFile(pixelImagePath);
});

// const handlePixelHit = asyncHandler(async (req, res) => {
//   console.log("📬 TEST ROUTE HIT!");
//   res.status(200).send("Route Hit Successfully!");
// });

const getStatus = asyncHandler(async (req, res) => {
  const { emailId } = req.params;
  if (!emailId) {
    throw new ApiError(400, "Email ID is required");
  }
  const email = await Email.findOne({ emailId });
  if (!email) {
    throw new ApiError(404, "Email not found");
  }

  return res.status(200).json({
    opened: email.opened,
    openedAt: email.openedAt,
  });
});

const sendEmailController = asyncHandler(async (req, res) => {
  const { to, subject, message } = req.body;

  // 1. Validate input
  if (!to || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: to, subject, or message",
    });
  }

  try {
    // 2. Generate unique emailId
    const emailId = crypto.randomUUID();

    // 3. Save to DB
    await Email.create({ emailId });

    //Caching ko rokne ke liye ek random number add karein
    const timestamp = new Date().getTime();
    // 4. Build HTML content with pixel tracking
    const htmlContent = `
      <div>
        <p>${message}</p>
        <img 
          src="${process.env.BASE_URL}/track?emailId=${emailId}" 
          width="100" 
          height="100" 
          style="border: 2px solid red;" 
          alt=""
        />
      </div>
    `;

    // 5. Send email
    await sendEmailWithPixel(to, subject, htmlContent);

    // 6. Success response
    res.status(200).json({
      success: true,
      message: "Email sent successfully",
      emailId,
    });

    console.log(`Email sent to ${to} with tracking ID: ${emailId}`);
    console.log(process.env.BASE_URL);
  } catch (error) {
    console.error("Email send error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});

export { handlePixelHit, getStatus, sendEmailController };
