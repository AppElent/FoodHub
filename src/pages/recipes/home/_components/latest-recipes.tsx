import RecipeCard from '@/components/recipes/recipe-card';
import useRouter from '@/hooks/use-router';
import { Recipe } from '@/schemas/recipe';
import { Container, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LatestRecipes = ({ recipes }: { recipes: Recipe[] }) => {
  const { t } = useTranslation('foodhub');
  const router = useRouter();
  // TODO: fix pathing issue
  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4, flexGrow: 1 }}
    >
      <Typography
        variant="h4"
        component="h2"
        sx={{ mb: 4, textAlign: 'center' }}
      >
        {t('pages.home.featured')}
      </Typography>
      <Grid
        container
        spacing={4}
      >
        {recipes.map((recipe) => (
          <Grid
            item
            key={recipe.id}
            xs={12}
            sm={6}
            md={4}
            onClick={() => router.push(`/app/recipes/${recipe.id}`)}
          >
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LatestRecipes;
