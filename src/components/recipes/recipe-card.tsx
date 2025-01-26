import useRouter from '@/hooks/use-router';
import { Recipe } from '@/schemas/recipes/recipe';
import { AccessTime as AccessTimeIcon, Restaurant as RestaurantIcon } from '@mui/icons-material';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import NoImageAvailable from '../default/images/no-image-available';

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const { t } = useTranslation();
  const router = useRouter();
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
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          onClick={() => router.push(recipe.id)}
          size="small"
          variant="contained"
        >
          {t('common:actions.show')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;
