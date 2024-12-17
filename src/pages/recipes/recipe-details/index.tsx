import RecipeDetails from '@/components/recipes/recipe-details';
import useParamItem from '@/hooks/use-param-item';
import { useData } from '@/libs/data-sources';
import DefaultPage from '@/pages/default/DefaultPage';
import { Recipe } from '@/schemas/recipe';

const RecipeDetailsPage = () => {
  const { data: recipes } = useData<Recipe[]>('recipes');
  const recipe = useParamItem<Recipe>({
    items: recipes || [],
  });
  //   console.log(recipes, recipe);
  //   const location = useLocation();
  //   const navigate = useNavigate();

  //   // Determine if we came from "My Recipes" or "Recipes"
  //   const isFromMyRecipes = location.state?.from === '/myrecipes';

  return (
    <DefaultPage currentPage={recipe?.name}>
      <RecipeDetails recipe={recipe} />
    </DefaultPage>
  );
};

export default RecipeDetailsPage;
