import { useData } from '@/libs/data-sources';
import DefaultPage from '@/pages/default/DefaultPage';
import { Recipe } from '@/schemas/recipe';
import { Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import LatestRecipes from './_components/latest-recipes';
import RecipeCarroussel from './_components/recipe-carroussel';
// TODO: Fix and implement the horizontal scroll card list component

const HomePage = () => {
  const { data: recipes } = useData<Recipe[]>('recipes');
  const { t } = useTranslation('foodhub');

  // Sort recipes by createdAt desc and pick the first 6 that have a non-nullish image
  const latestRecipes = useMemo(
    () =>
      recipes
        ?.sort((a, b) => {
          return (
            new Date(b.createdAt || new Date()).getTime() -
            new Date(a.createdAt || new Date()).getTime()
          );
        })
        .filter((recipe) => recipe.image && recipe?.score && recipe?.score > 3)
        .slice(0, 6),
    [recipes]
  );

  const carrousselRecipes = useMemo(() => {
    return recipes
      ?.filter((recipe) => recipe.image && recipe?.score && recipe?.score > 3)
      .slice(0, 6);
  }, [recipes]);

  return (
    <DefaultPage>
      <RecipeCarroussel recipes={carrousselRecipes || []} />
      <Typography
        align="center"
        variant="h6"
        component="h2"
        gutterBottom
      >
        {t('pages.home.description')}
      </Typography>
      <LatestRecipes recipes={latestRecipes || []} />
      {/* <HorizontalScrollCardList>
        {recipes.map((recipe: Recipe) => {
          return (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
            />
          );
        })}
      </HorizontalScrollCardList> */}
    </DefaultPage>
  );
};

export default HomePage;
