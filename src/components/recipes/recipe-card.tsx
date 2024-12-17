import { Recipe } from '@/schemas/recipe';
import { AccessTime as AccessTimeIcon, Restaurant as RestaurantIcon } from '@mui/icons-material';
import { Card, CardContent, CardMedia, Chip, Rating, Typography } from '@mui/material';
import NoImageAvailable from '../default/images/no-image-available';

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <Card sx={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
      {recipe.image ? (
        <CardMedia
          component="img"
          height="160"
          image={recipe.image}
          alt={recipe.name}
        />
      ) : (
        <NoImageAvailable />
      )}
      <CardContent>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {/* {recipe.time?.cooking && <>Cooking Time: {recipe.time.cooking} minutes</>} */}
          <Rating
            value={recipe.score || 0}
            readOnly
            precision={0.5}
          />
        </Typography>
        <Typography
          variant="h6"
          component="div"
        >
          {recipe.name}
        </Typography>
        {recipe.time && (
          <>
            {!!recipe.time.prep && (
              <Chip
                icon={<AccessTimeIcon />}
                label={`Prep: ${recipe.time.prep} min`}
                variant="outlined"
                sx={{ bgcolor: 'background.paper', m: 0.5 }}
              />
            )}
            {!!recipe.time.cooking && (
              <Chip
                icon={<AccessTimeIcon />}
                label={`Cook: ${recipe.time.cooking} min`}
                variant="outlined"
                sx={{ bgcolor: 'background.paper', m: 0.5 }}
              />
            )}
            {!!recipe.time.total && (
              <Chip
                icon={<AccessTimeIcon />}
                label={`Total: ${recipe.time.total} min`}
                variant="outlined"
                sx={{ bgcolor: 'background.paper', m: 0.5 }}
              />
            )}
          </>
        )}
        {recipe.yieldsText && (
          <Chip
            icon={<RestaurantIcon />}
            label={`${recipe.yieldsText}`}
            variant="outlined"
            sx={{ bgcolor: 'background.paper', m: 0.5 }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
