import useDialog from '@/hooks/use-dialog';
import useIsMobile from '@/hooks/use-is-mobile';
import { useAuth } from '@/libs/auth';
import { Recipe } from '@/schemas/recipe';
import {
  AccessTime as AccessTimeIcon,
  Edit as EditIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import RecipeEditDialog from '../../sections/recipes/recipe-edit-dialog';
import NoImageAvailable from '../default/images/no-image-available';
import ImageList from '../default/ui/image-list';

// TODO: add image viewer and set image as default

const RecipeDetails = ({ recipe }: { recipe?: Recipe }) => {
  const dialog = useDialog();
  const { t } = useTranslation();
  // Get user
  const { user } = useAuth();

  // is mobile
  const isMobile = useIsMobile();

  const handleEdit = () => {
    dialog.open();
  };

  if (!recipe) {
    return <Paper>No recipe found</Paper>;
  }

  return (
    <Paper
      elevation={3}
      sx={{ overflow: 'hidden' }}
    >
      <RecipeEditDialog
        open={dialog.isOpen}
        recipe={recipe}
        onClose={() => dialog.close()}
      />
      {recipe.image ? (
        <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
          <Box
            component="img"
            src={recipe.image || '/placeholder.svg?height=400&width=600'}
            alt={recipe.name}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      ) : (
        <NoImageAvailable />
      )}

      <Box sx={{ p: 4 }}>
        <Stack
          direction={isMobile ? 'column' : 'row'}
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
        >
          <Typography
            variant="h4"
            component="h1"
          >
            {recipe.name}
          </Typography>
          {user?.id === recipe.owner && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              {t('common:actions.edit')}
            </Button>
          )}
        </Stack>
        {recipe.description && (
          <Typography
            variant="body1"
            paragraph
            color="text.secondary"
            sx={{ fontSize: '1.1rem' }}
          >
            {recipe.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          {!!recipe.score && (
            <Rating
              value={recipe.score || 0}
              readOnly
              precision={0.5}
            />
          )}
          {recipe.time && (
            <>
              {!!recipe.time.prep && (
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`Prep: ${recipe.time.prep} min`}
                  variant="outlined"
                  sx={{ bgcolor: 'background.paper' }}
                />
              )}
              {!!recipe.time.cooking && (
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`Cook: ${recipe.time.cooking} min`}
                  variant="outlined"
                  sx={{ bgcolor: 'background.paper' }}
                />
              )}
              {!!recipe.time.total && (
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`Total: ${recipe.time.total} min`}
                  variant="outlined"
                  sx={{ bgcolor: 'background.paper' }}
                />
              )}
            </>
          )}
          {recipe.yieldsText && (
            <Chip
              icon={<RestaurantIcon />}
              label={`${recipe.yieldsText}`}
              variant="outlined"
              sx={{ bgcolor: 'background.paper' }}
            />
          )}
        </Box>
        <Grid
          container
          spacing={4}
        >
          <Grid
            item
            xs={12}
            md={8}
          >
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <Paper
                elevation={1}
                sx={{ p: 3, mb: 3 }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary"
                >
                  {t('foodhub:schemas.recipe.ingredients')}
                </Typography>
                <List>
                  {recipe.ingredients.map((ingredient, index) => (
                    <ListItem
                      key={index}
                      disablePadding
                      sx={{ py: 1 }}
                    >
                      <ListItemText
                        primary={ingredient}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: 'text.primary',
                            fontSize: '1.1rem',
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <Paper
                elevation={1}
                sx={{ p: 3 }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary"
                >
                  {t('foodhub:schemas.recipe.instructions')}
                </Typography>
                <List>
                  {recipe.instructions.map((instruction, index) => (
                    <ListItem
                      key={index}
                      alignItems="flex-start"
                      sx={{ py: 2 }}
                    >
                      <ListItemText
                        primary={`Step ${index + 1}`}
                        secondary={instruction}
                        primaryTypographyProps={{
                          color: 'primary',
                          fontWeight: 600,
                          gutterBottom: true,
                        }}
                        secondaryTypographyProps={{
                          color: 'text.primary',
                          fontSize: '1.1rem',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
          >
            {recipe.nutrients && Object.keys(recipe.nutrients).length > 0 && (
              <Paper
                elevation={1}
                sx={{ p: 3, mb: 3 }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  color="primary"
                >
                  {t('foodhub:schemas.recipe.nutrients.value')}
                </Typography>
                <List dense>
                  {Object.entries(recipe.nutrients).map(([key, value]) => (
                    <ListItem
                      key={key}
                      disablePadding
                      sx={{ py: 1 }}
                    >
                      <ListItemText
                        primary={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: 'text.primary',
                            fontSize: '1rem',
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}

            <Paper
              elevation={1}
              sx={{ p: 3, mb: 3 }}
            >
              {recipe.category && (
                <>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    color="primary"
                    fontWeight="600"
                  >
                    {t('foodhub:schemas.recipe.category')}
                  </Typography>
                  <Chip
                    label={recipe.category}
                    sx={{
                      mb: 3,
                      bgcolor: 'secondary.main',
                      color: 'secondary.contrastText',
                    }}
                  />
                </>
              )}
              {recipe.cuisine && recipe.cuisine.length > 0 && (
                <>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    color="primary"
                    fontWeight="600"
                  >
                    {t('foodhub:schemas.recipe.cuisine')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {recipe.cuisine.map((item) => (
                      <Chip
                        key={item}
                        label={item}
                        size="small"
                        sx={{
                          bgcolor: 'secondary.light',
                          color: 'secondary.contrastText',
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
              {recipe.keywords && recipe.keywords.length > 0 && (
                <>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    color="primary"
                    fontWeight="600"
                  >
                    {t('foodhub:schemas.recipe.keywords')}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {recipe.keywords.map((keyword) => (
                      <Chip
                        key={keyword}
                        label={keyword}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Paper>

            <Box sx={{ px: 1 }}>
              {recipe.createdAt && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {t('foodhub:schemas.recipe.createdAt')}:{' '}
                  {new Date(recipe.createdAt).toLocaleDateString()}
                </Typography>
              )}
              {recipe.updatedAt && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {t('foodhub:schemas.recipe.updatedAt')}:{' '}
                  {new Date(recipe.updatedAt).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
        <Paper>
          <Box sx={{ maxWidth: '350px', overflow: 'hidden' }}>
            <ImageList
              images={(recipe.images as string[]) || []}
              onClick={() => {}}
            />
          </Box>
        </Paper>
      </Box>
    </Paper>
  );
};

export default RecipeDetails;
