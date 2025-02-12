import RecipeOverview from '@/components/recipes/recipe-overview';
import useAuth from '@/libs/auth/use-auth';
import { useData } from '@/libs/data-sources-old';
import DefaultPage from '@/pages/default/DefaultPage';
import { Recipe } from '@/schemas/recipes/recipe';
import _ from 'lodash';
import { useMemo } from 'react';

const RecipeOverviewPage = () => {
  const { data } = useData<Recipe>('recipes');
  const { user } = useAuth();

  const allRecipes = useMemo(() => {
    if (!data) return [];
    return _.sortBy(
      data.filter((r) => r.owner !== user?.id),
      [
        (item) => !item.image || item.image.trim() === '', // Sort by whether image is empty (false -> first)
        'name', // Sort alphabetically by name
      ]
    );
  }, [data, user]);

  return (
    <DefaultPage>
      <RecipeOverview recipes={allRecipes || []} />
      {/* //{' '}
      </DefaultPaperbasePage> */}
    </DefaultPage>
  );
};

export default RecipeOverviewPage;
