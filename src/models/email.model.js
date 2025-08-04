import mongoose, { mongo, Schema } from "mongoose";

const emailSchema = new Schema({
  emailId: {
    type: String,
    required: true,
    unique: true,
  },
  opened: {
    type: Boolean,
    default: false,
  },
  openedAt: { type: Date, default: null },
});

export const Email = mongoose.model("Email", emailSchema);
