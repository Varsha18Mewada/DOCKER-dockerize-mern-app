import { Routes, Route } from 'react-router-dom';
import { ViewAllRecipes } from '../pages/view-all-recipes/ViewAllRecipes';
import { AddRecipe } from '../pages/addRecipe/AddRecipe';
import PrivateComponent from '../components/auth/PrivateComponent';
import { RecipeDetails } from '../pages/view-single-recipe/RecipeDetails';
export const PrivateRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateComponent />}>
        <Route path="/" element={<ViewAllRecipes />} />
        <Route path="/addRecipe" element={<AddRecipe />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
      </Route>
    </Routes>
  );
};
