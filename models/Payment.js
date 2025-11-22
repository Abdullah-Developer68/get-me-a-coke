import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const paymentSchema = new Schema(
  {
    name: { type: String, required: true },
    to_user: { type: String, required: true, index: true },
    oid: { type: String, required: true },
    message: String,
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

// Use a consistent, singular, capitalized model name and guard against recompilation
const Payment = models.Payment || model("Payment", paymentSchema);
export default Payment;
