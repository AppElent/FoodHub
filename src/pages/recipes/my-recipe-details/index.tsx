import RecipeDetails from '@/components/recipes/recipe-details';
import useParamItem from '@/hooks/use-param-item';
import useAuth from '@/libs/auth/use-auth';
import { useData } from '@/libs/data-sources';
import DefaultPage from '@/pages/default/DefaultPage';
import { Recipe } from '@/schemas/recipes/recipe';
import { useMemo } from 'react';

const MyRecipeDetailsPage = () => {
  const { data: recipes } = useData<Recipe>('recipes');
  const recipe = useParamItem<Recipe>({
    items: recipes || [],
  }) as Recipe;
  const auth = useAuth({ redirectUnauthenticated: true });
  const myRecipes = useMemo(
    () => recipes?.filter((r) => r.owner === auth.user?.id),
    [recipes, auth.user?.id]
  );
  //   console.log(recipes, recipe);
  //   const location = useLocation();
  //   const navigate = useNavigate();

  //   // Determine if we came from "My Recipes" or "Recipes"
  //   const isFromMyRecipes = location.state?.from === '/myrecipes';
  const options = {
    myRecipeDetails: {
      getLabel: () => recipe?.name,
      options: myRecipes?.map((recipe) => ({
        label: recipe.name,
        key: recipe.id,
      })),
    },
  };

  return (
    <DefaultPage options={options}>
      <RecipeDetails recipe={recipe} />
    </DefaultPage>
  );
};

export default MyRecipeDetailsPage;
