const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createRecipe,
  getRecipeById,
  searchRecipe,
  addRating,
  addComment,
  fetchRecipes,
} = require("../controllers/RecipeController");

// Setup Multer for handling file uploads
const storage = multer.memoryStorage(); // Store file in memory (as buffer)
const upload = multer({ storage: storage });

router.post("/recipe", upload.single("image"), createRecipe); // 'image' is the name of the form field
router.get("/recipe/details", getRecipeById);
router.get("/searchRecipes/:key", searchRecipe);
router.post("/recipe/rate", addRating);
router.post("/recipe/comment", addComment);
router.get("/recipe", fetchRecipes);

module.exports = router;
