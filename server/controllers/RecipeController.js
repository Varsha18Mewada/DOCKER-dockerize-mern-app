const RecipeModel = require("../models/Recipes");

const createRecipe = async (req, res) => {
  const { title, ingredients, steps, cookingTime, userOwner } = req.body;

  if (!title || !ingredients || !steps || !cookingTime) {
    return res.json({ error: "Missing recipe details" });
  }

  const recipe = new RecipeModel({
    title,
    ingredients,
    steps,
    image: {
      data: req.file.buffer, // Store the file buffer (binary data)
      contentType: req.file.mimetype, // Store the MIME type of the file
    },
    cookingTime,
    userOwner,
    averageRating: 0,
  });
  try {
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRecipeById = async (req, res) => {
  try {
    const id = req.query.recipeId.trim();
    const recipe = await RecipeModel.findById(id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Invalid recipeId" });
  }
};

const searchRecipe = async (req, res) => {
  try {
    const searchKey = req.params.key.trim();

    const recipes = await RecipeModel.find({
      ingredients: {
        $regex: new RegExp(searchKey, "i"),
      },
    });
    if (recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found" });
    }
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const addRating = async (req, res) => {
  try {
    const { recipeId, rating, userId, userName } = req.body;

    const recipe = await RecipeModel.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if the user has already rated the recipe
    const index = recipe.ratingsAndComments.findIndex(
      (entry) => entry.user.toString() === userId.toString()
    );

    if (index !== -1) {
      // If the user has already rated, update the existing rating
      recipe.ratingsAndComments[index].rating = rating;
    } else {
      // Otherwise, add a new rating
      recipe.ratingsAndComments.push({ user: userId, userName, rating });
    }

    // Recalculate average rating
    const totalRatings = recipe.ratingsAndComments.reduce(
      (acc, entry) => acc + entry.rating,
      0
    );
    const avgRating = totalRatings / recipe.ratingsAndComments.length || 0;

    // Round the average rating to the nearest integer
    const roundedAvgRating = Math.round(avgRating);

    // Update the average rating field
    recipe.averageRating = roundedAvgRating;

    await recipe.save();
    res.status(200).json({ message: "Rating added successfully" });
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const addComment = async (req, res) => {
  try {
    const { recipeId, comment, userId, userName } = req.body;

    const recipe = await RecipeModel.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Check if the user has already rated the recipe
    const index = recipe?.ratingsAndComments?.findIndex(
      (entry) => entry.user.toString() === userId.toString()
    );

    if (index !== -1) {
      // If the user has already rated, update the existing rating
      recipe.ratingsAndComments[index].comment = comment;
    } else {
      // Otherwise, add a new rating
      recipe.ratingsAndComments.push({ user: userId, comment, userName });
    }

    await recipe.save();
    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchRecipes = async (req, res) => {
  try {
    // Initialize filter condition
    let filterCondition = {};

    // Get filters from the query params
    const { rating, cookingTime } = req.query;

    // If rating is provided, add it to the filter condition
    if (rating) {
      // Convert rating to a number if it's not already
      const ratingValue = parseInt(rating, 10);
      if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        return res.status(400).json({
          error: "Invalid rating value. Rating must be between 1 and 5.",
        });
      }
      filterCondition.averageRating = ratingValue;
    }

    // If cookingTime is provided, add it to the filter condition
    if (cookingTime) {
      const cookingTimeValue = parseInt(cookingTime, 10);
      if (isNaN(cookingTimeValue)) {
        return res.status(400).json({ error: "Invalid cooking time value." });
      }

      // Depending on the cookingTime value, adjust the filter condition
      if (cookingTimeValue === 30) {
        filterCondition.cookingTime = { $lte: 30 }; // Less than or equal to 30 minutes
      } else if (cookingTimeValue === 60) {
        filterCondition.cookingTime = { $lte: 60 }; // Less than or equal to 60 minutes
      } else if (cookingTimeValue === 61) {
        filterCondition.cookingTime = { $gt: 60 }; // Greater than 60 minutes
      } else {
        return res.status(400).json({
          error:
            "Invalid cooking time value. Allowed values are 30, 60, or 61.",
        });
      }
    }

    // Fetch recipes based on filter condition
    const recipes = await RecipeModel.find(filterCondition);

    // If no recipes are found, return a message
    if (recipes.length === 0) {
      return res.status(404).json({
        error: "No recipes found matching the specified filter criteria.",
      });
    }

    // Return the filtered recipes
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error filtering recipes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createRecipe,
  getRecipeById,
  searchRecipe,
  addRating,
  addComment,
  fetchRecipes,
};
