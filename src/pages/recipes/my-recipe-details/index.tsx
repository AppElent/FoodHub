import RecipeDetails from '@/components/recipes/recipe-details';
import useParamItem from '@/hooks/use-param-item';
import usePathRouter from '@/hooks/use-path-router';
import useAuth from '@/libs/auth/use-auth';
import DefaultPage from '@/pages/default/DefaultPage';
import { Recipe } from '@/schemas/recipes/recipe';
import useDataHelper from '@/schemas/use-data-helper';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const MyRecipeDetailsPage = () => {
  const { t } = useTranslation();
  const { data: recipes, deleteItem } = useDataHelper<Recipe>('recipes', {
    label: t('foodhub:defaults.recipe'),
  });
  const recipe = useParamItem<Recipe>({
    items: recipes || [],
    id: 'recipeId',
  });
  const router = usePathRouter();

  const deleteRecipe = async () => {
    await deleteItem(recipe?.id);
    router.push('myRecipes');
  };
  const auth = useAuth({ redirectUnauthenticated: true });
  const myRecipes = useMemo(
    () => recipes?.filter((r) => r.owner === auth.user?.id),
    [recipes, auth.user?.id]
  );

  const options = recipe
    ? {
        recipeDetails: {
          getLabel: () => recipe.name,
          options: myRecipes?.map((recipe) => ({
            label: recipe.name,
            key: recipe.id,
          })),
        },
      }
    : undefined;

  return (
    <DefaultPage options={options}>
      <RecipeDetails
        recipe={recipe}
        deleteRecipe={deleteRecipe}
      />
    </DefaultPage>
  );
};

export default MyRecipeDetailsPage;
