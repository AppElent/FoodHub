// import { Outlet, RouteObject } from 'react-router-dom';

// import PaperbaseLayout from '@/layouts/paperbase/Layout';
// import HomePage from '@/pages/home';
// import MyRecipeOverviewPage from '@/pages/recipes/my-recipe-overview';
// import RecipeDetailsPage from '@/pages/recipes/recipe-details';
// import RecipeOverviewPage from '@/pages/recipes/recipe-overview';
import appRoutes from '@/routes/appRoutes';
import { Home as HomeIcon } from '@mui/icons-material';
import FlatwareIcon from '@mui/icons-material/Flatware';
import { Outlet, RouteObject } from 'react-router-dom';
//import { PathItem } from './paths';

export type CustomRouteObject = RouteObject & {
  id: string;
  label: string;
  Icon: JSX.Element;
  translationKey?: string;
  category?: string;
  children?: CustomRouteObject[] | any;
};

export const routes: CustomRouteObject[] = [
  {
    id: 'home',
    label: 'Home',
    Icon: <HomeIcon fontSize="inherit" />,
    path: 'app',
    children: [
      {
        id: 'homeIndex',
        index: true,
      },
      {
        id: 'recipes',
        label: 'Recipes',
        translationKey: 'foodhub:menu.allrecipes',
        Icon: <FlatwareIcon fontSize="inherit" />,
        category: 'recipes',
        path: 'recipes',
        element: <Outlet />,
        children: [
          {
            id: 'recipesIndex',
            index: true,
          },
          {
            id: 'myRecipes',
            label: 'My recipes',
            translationKey: 'foodhub:menu.myRecipes',
            Icon: <FlatwareIcon fontSize="inherit" />,
            category: 'recipes',
            path: 'my',
            element: <Outlet />,
            children: [
              {
                id: 'myRecipesIndex',
                index: true,
              },
              {
                id: 'myRecipeNew',
                label: 'New recipe',
                Icon: <FlatwareIcon fontSize="inherit" />,
                path: 'new',
              },
              {
                id: 'myRecipeDetails',
                label: 'Recipe details',
                Icon: <FlatwareIcon fontSize="inherit" />,
                path: ':id',
                element: <Outlet />,
                children: [
                  {
                    id: 'myRecipeDetailsIndex',
                    index: true,
                  },
                  {
                    id: 'myRecipeEdit',
                    label: 'Edit',
                    Icon: <FlatwareIcon fontSize="inherit" />,
                    path: 'edit',
                  },
                ],
              },
            ],
          },
          {
            id: 'recipeDetails',
            label: 'Recipe details',
            Icon: <FlatwareIcon fontSize="inherit" />,
            path: ':id',
          },
        ],
      },

      ...appRoutes,
    ],
  },
  //   ...defaultRoutes,
];

// const routes2 = generateRouteObjects(routes);
// console.log('ROUTES', routes2);

export const paths = getAllPaths(routes);

// Function to create a flat list of all paths with custom properties
function getAllPaths(routes: CustomRouteObject[], parentPath: string = ''): any[] {
  return routes.flatMap((route) => {
    const currentPath = route.path
      ? `${parentPath}/${route.path}`.replace(/\/+/g, '/')
      : parentPath;
    const { children, ...routeInfo } = route;
    const currentRoute = { ...routeInfo, to: currentPath };
    const childrenPaths = children ? getAllPaths(children, currentPath) : [];
    return [currentRoute, ...childrenPaths];
  });
}

export default routes;
