const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true,
    },
    full_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, required: true },
    account: accountSchema,
    avatar: { type: String, required: true }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
