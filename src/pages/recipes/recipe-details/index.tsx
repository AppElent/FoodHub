import RecipeDetails from '@/components/recipes/recipe-details';
import useParamItem from '@/hooks/use-param-item';
import DefaultPage from '@/pages/default/DefaultPage';
import { Recipe } from '@/schemas/recipes/recipe';
import useDataHelper from '@/schemas/use-data-helper';

const RecipeDetailsPage = () => {
  const { data: recipes } = useDataHelper<Recipe>('recipes');
  const recipe = useParamItem<Recipe>({
    items: recipes || [],
    id: 'recipeId',
  });

  const options = recipe
    ? {
        recipeDetails: {
          getLabel: () => recipe.name,
          options: recipes?.map((recipe) => ({
            label: recipe.name,
            key: recipe.id,
          })),
        },
      }
    : undefined;

  return (
    <DefaultPage options={options}>
      <RecipeDetails recipe={recipe} />
    </DefaultPage>
  );
};

export default RecipeDetailsPage;
