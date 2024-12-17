import SearchBar from '@/components/default/ui/search-bar';
import RecipeOverviewGalleryView from '@/components/recipes/recipe-gallery-view';
import useDialog from '@/hooks/use-dialog';
import useFilter from '@/hooks/use-filter';
import useIsMobile from '@/hooks/use-is-mobile';
import useQueryParamAction from '@/hooks/use-query-param-action';
import useRouter from '@/hooks/use-router';
import { Recipe } from '@/schemas/recipe';
import RecipeEditDialog from '@/sections/recipes/recipe-edit-dialog';
import AddIcon from '@mui/icons-material/Add'; // Import AddIcon
import { Fab, FormControl, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import RecipeOverviewListView from './recipe-list-view';

function RecipeOverview({ recipes = [] }: { recipes: Recipe[] }) {
  const [view /*, setView*/] = useState('gallery');
  const dialog = useDialog({ queryKey: 'recipe' });
  useQueryParamAction(
    'url',
    (_url) => {
      dialog.open('new');
    },
    { removeAfterAction: false }
  );

  const router = useRouter();

  // For mobile, set no minWidth on sort options
  const isMobile = useIsMobile();

  const handleAddRecipe = useCallback(() => {
    //dialog.setData(undefined); // Clear dialog data for new recipe
    dialog.open('new');
  }, [dialog]); // TODO: receive url in dialog and remove it from query params

  const { data: filteredItems, ...filterOptions } = useFilter(recipes, {
    initialSortField: 'score',
    initialSortDirection: 'desc',
    initialRowsPerPage: 25,
    initialPage: 0,
    updateInitialData: true,
    //searchableFields: ['name'],
  });

  const handleRecipeClick = (recipe: Recipe) => {
    //dialog.setData(recipe);
    //dialog.open(recipe.id);
    console.log(window.location.pathname);
    router.push(`${window.location.pathname}/${recipe.id}`);
  };

  const handleSortChange = (event: any) => {
    filterOptions.setSortField(event.target.value.split('-')[0]);
    filterOptions.setSortDirection(event.target.value.split('-')[1]);
  };

  const fabStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 16,
    right: 16,
  };

  const sortOptions = [
    { value: 'name-asc', label: 'Name (Ascending)' },
    { value: 'createdAt-desc', label: 'Date added (Newest first)' },
    { value: 'updatedAt-desc', label: 'Date modified (Newest first)' },
    { value: 'score-desc', label: 'Rating (Highest first)' },
  ];

  return (
    <>
      <RecipeEditDialog
        open={dialog.isOpen}
        onClose={() => dialog.close()}
      />

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
      {/* Toggle button to switch between views */}
      {/* <Stack
        justifyContent={'space-between'}
        direction={'row'}
        alignItems={'center'}
        sx={{ mb: 1 }}
      > */}
      <Grid
        container
        spacing={2}
        justifyContent={'space-between'}
        sx={{ mb: 2 }}
      >
        {/* <Grid
          item
          xs={12}
          md={6}
        >
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view toggle"
            //style={{ marginBottom: '16px' }}
          >
            <ToggleButton
              value="gallery"
              aria-label="gallery view"
            >
              <ViewModuleIcon /> Gallery
            </ToggleButton>
            <ToggleButton
              value="list"
              aria-label="list view"
            >
              <ViewListIcon /> List
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid> */}
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
      {view === 'gallery' && (
        <RecipeOverviewGalleryView
          recipes={filteredItems}
          handleRecipeClick={handleRecipeClick}
        />
      )}

      {/* List View */}
      {view === 'list' && (
        <RecipeOverviewListView
          recipes={filteredItems}
          handleRecipeClick={handleRecipeClick}
        />
      )}
      <Fab
        color="primary"
        aria-label="add"
        style={fabStyle}
        onClick={handleAddRecipe}
      >
        <AddIcon />
      </Fab>
    </>
  );
}

export default RecipeOverview;
