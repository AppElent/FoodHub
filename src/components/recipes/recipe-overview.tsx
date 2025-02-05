import SearchBar from '@/components/default/ui/search-bar';

import useIsMobile from '@/hooks/use-is-mobile';
import useRouter from '@/hooks/use-router';
import useFilter from '@/libs/filters/use-filter';
import { Recipe } from '@/schemas/recipes/recipe';
import { FormControl, Grid, MenuItem, Stack, TextField } from '@mui/material';
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
  const isMobile = useIsMobile();

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

  const handleSortChange = (event: any) => {
    filterOptions.setSortField(event.target.value.split('-')[0]);
    filterOptions.setSortDirection(event.target.value.split('-')[1]);
  };

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
        <SearchBar
          onClear={() => filterOptions.setSearchQuery('')}
          value={filterOptions.searchQuery}
          onChange={(e) => filterOptions.setSearchQuery(e.target.value)}
          placeholder={`Search recipes`}
        />
      </Stack>
      <Grid
        container
        spacing={2}
        justifyContent={'space-between'}
        sx={{ mb: 2 }}
      >
        <Grid item>
          <FormControl
            className="sort-options"
            sx={{ minWidth: isMobile ? undefined : 275 }}
          >
            <TextField
              id="sort-label"
              label="Sort By"
              select
              value={`${filterOptions.sortField}-${filterOptions.sortDirection}`}
              onChange={handleSortChange}
              margin="dense"
              size="small"
            >
              {sortOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </Grid>
      </Grid>

      {/* Gallery View */}
      <Grid
        container
        spacing={4}
      >
        {filteredItems.map((recipe: Recipe) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
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
