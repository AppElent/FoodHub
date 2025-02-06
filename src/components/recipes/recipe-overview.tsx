import useRouter from '@/hooks/use-router';
import SearchBar from '@/libs/filters/components/search-bar';
import SortOptions from '@/libs/filters/components/sort-options';
import useFilter from '@/libs/filters/use-filter';
import { Recipe } from '@/schemas/recipes/recipe';
import { Grid2 as Grid, Stack } from '@mui/material';
import { useCallback } from 'react';
import FloatingButton from '../default/floating-button';
import RecipeCard from './recipe-card';

function RecipeOverview({
  recipes = [],
  currentUser,
}: {
  recipes: Recipe[];
  currentUser?: string;
}) {
  const router = useRouter();

  // For mobile, set no minWidth on sort options
  // const isMobile = useIsMobile();

  const handleAddRecipe = useCallback(() => {
    router.push('new');
  }, [router]);

  const { data: filteredItems, ...filterOptions } = useFilter(recipes, {
    initialSortField: 'score',
    initialSortDirection: 'desc',
    initialRowsPerPage: 25,
    initialPage: 0,
    updateInitialData: true,
    //searchableFields: ['name'],
  });

  const sortOptions = [
    { value: 'name-asc', label: 'Name (Ascending)' },
    { value: 'createdAt-desc', label: 'Date added (Newest first)' },
    { value: 'updatedAt-desc', label: 'Date modified (Newest first)' },
    { value: 'score-desc', label: 'Rating (Highest first)' },
  ];

  return (
    <>
      <Stack
        spacing={2}
        mb={2}
      >
        <SearchBar filter={filterOptions} />
      </Stack>
      <Grid
        container
        spacing={2}
        justifyContent={'space-between'}
        sx={{ mb: 2 }}
      >
        <Grid>
          <SortOptions
            filter={filterOptions}
            options={sortOptions}
          />
        </Grid>
      </Grid>

      {/* Gallery View */}
      <Grid
        container
        spacing={4}
      >
        {filteredItems.map((recipe: Recipe) => (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
            key={recipe.id}
          >
            <RecipeCard
              recipe={recipe}
              currentUser={currentUser}
            />
          </Grid>
        ))}
      </Grid>

      <FloatingButton handleAdd={handleAddRecipe} />
    </>
  );
}

export default RecipeOverview;
