import appRoutes from '@/routes/appRoutes';
import { Home as HomeIcon } from '@mui/icons-material';
import FlatwareIcon from '@mui/icons-material/Flatware';
import { JSX } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

export type CustomRouteObject = RouteObject & {
  id: string;
  label: string;
  Icon: JSX.Element;
  translationKey?: string;
  category?: string;
  loginRequired?: boolean;
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
            loginRequired: true,
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
                path: ':recipeId',
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
            path: ':recipeId',
          },
        ],
      },
      {
        id: 'foodtracker',
        label: 'Foodtracker',
        path: 'foodtracker',
        translationKey: 'foodhub:menu.foodtracker',
        Icon: <FlatwareIcon fontSize="inherit" />,
        category: 'foodtracker',
        element: <Outlet />,
        children: [
          {
            id: 'foodtrackerIndex',
            index: true,
          },
        ],
      },
      {
        id: 'favorites',
        label: 'Favorites',
        path: 'favorites',
        translationKey: 'foodhub:menu.favorites',
        Icon: <FlatwareIcon fontSize="inherit" />,
        //category: 'favorites',
        children: [
          {
            id: 'favoritesIndex',
            index: true,
          },
          {
            id: 'wine',
            label: 'Wine',
            Icon: <FlatwareIcon fontSize="inherit" />,
            translationKey: 'foodhub:schemas.favorites.wine.wine',
            path: 'wine',
            category: 'favorites',
          },
          {
            id: 'cheese',
            label: 'Cheese',
            Icon: <FlatwareIcon fontSize="inherit" />,
            translationKey: 'foodhub:schemas.favorites.cheese.cheese',
            path: 'cheese',
            category: 'favorites',
          },
          {
            id: 'beer',
            label: 'Beer',
            Icon: <FlatwareIcon fontSize="inherit" />,
            translationKey: 'foodhub:schemas.favorites.beer.beer',
            path: 'beer',
            category: 'favorites',
          },
        ],
      },

      ...appRoutes,
    ],
  },
  //   ...defaultRoutes,
];

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
