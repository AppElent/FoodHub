import RecipeOverview from '@/components/recipes/recipe-overview';
import { useAuth } from '@/libs/auth';
import { useData } from '@/libs/data-sources';
import DefaultPage from '@/pages/default/DefaultPage';
import { Recipe } from '@/schemas/recipe';

interface RecipeWithOwner extends Recipe {
  owner: string;
}

const MyRecipeOverviewPage = () => {
  const { data } = useData<RecipeWithOwner[]>('recipes');
  const auth = useAuth({ redirectUnauthenticated: true });
  console.log(auth);

  const myRecipes = data?.filter((recipe) => recipe.owner === auth.user?.id);

  return (
    <DefaultPage>
      <RecipeOverview recipes={myRecipes || []} />
      {/* //{' '}
      </DefaultPaperbasePage> */}
    </DefaultPage>
  );
};

export default MyRecipeOverviewPage;
