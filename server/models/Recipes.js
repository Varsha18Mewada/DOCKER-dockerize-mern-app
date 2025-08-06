const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: [{ type: String, required: true }],
  steps: { type: String, required: true },
  image: {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
  },
  cookingTime: {
    type: Number,
    required: true,
  },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  ratingsAndComments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      userName: { type: String, required: true },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
    },
  ],
  averageRating: {
    type: Number,
  },
});
module.exports = mongoose.model("Recipes", RecipeSchema);
