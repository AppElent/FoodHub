import RecipeOverview from '@/components/recipes/recipe-overview';
import { useAuth } from '@/libs/auth';
import { useData } from '@/libs/data-sources';
import DefaultPage from '@/pages/default/DefaultPage';
import { Recipe } from '@/schemas/recipe';

const RecipeOverviewPage = () => {
  const { data } = useData<Recipe[]>('recipes');
  const { user } = useAuth();

  const allRecipes = data?.filter((recipe) => recipe.owner !== user?.id);

  return (
    <DefaultPage>
      <RecipeOverview recipes={allRecipes || []} />
      {/* //{' '}
      </DefaultPaperbasePage> */}
    </DefaultPage>
  );
};

export default RecipeOverviewPage;
