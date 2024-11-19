const mongoose = require("mongoose");

const castSchema = new mongoose.Schema(
  {
    personid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    person_name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    character_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Cast = mongoose.model("Cast", castSchema);

module.exports = Cast;
