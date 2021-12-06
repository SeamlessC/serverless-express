import { model, Schema, Number } from "mongoose";

const scheme = new Schema({
  date: {
    type: String,
    required: true,
    unique: true,
  },
  count_number: {
    type: Number,
    required: true,
  },
});

export default model("counter", scheme);
