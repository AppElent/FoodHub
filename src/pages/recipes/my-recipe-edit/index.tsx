import useParamItem from '@/hooks/use-param-item';
import { useData } from '@/libs/data-sources';
import DefaultPage from '@/pages/default/DefaultPage';
import { Recipe } from '@/schemas/recipes/recipe';
import RecipeEditCard from '@/sections/recipes/recipe-edit-card';

const MyRecipeEdit = () => {
  const { data: recipes } = useData<Recipe>('recipes');
  const recipe = useParamItem({
    items: recipes || [],
    id: 'recipeId',
  }) as Recipe;

  const options = {
    myRecipeDetails: {
      getLabel: () => recipe?.name,
      options: recipes?.map((recipe) => ({
        label: recipe.name,
        key: recipe.id,
      })),
    },
  };

  return (
    <DefaultPage options={options}>
      <RecipeEditCard recipe={recipe} />
    </DefaultPage>
  );
};

export default MyRecipeEdit;
