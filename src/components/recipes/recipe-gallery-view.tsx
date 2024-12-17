import RecipeCard from '@/components/recipes/recipe-card';
import { Recipe } from '@/schemas/recipe';
import { Grid } from '@mui/material';

//TODO: make a normal component not a page one

const RecipeOverviewGalleryView = ({
  recipes,
  handleRecipeClick,
}: {
  recipes: Recipe[];
  handleRecipeClick: (recipe: Recipe) => void;
}) => {
  return (
    <Grid
      container
      spacing={4}
    >
      {recipes.map((recipe: Recipe) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          key={recipe.id}
          onClick={() => handleRecipeClick(recipe)}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <RecipeCard recipe={recipe} />
        </Grid>
      ))}
    </Grid>
  );
};

export default RecipeOverviewGalleryView;
