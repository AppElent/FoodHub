import { Suspense } from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

import PaperbaseLayout from '@/layouts/paperbase/Layout';
import NotFound from '@/pages/default/404';
import SignIn from '@/pages/default/SignIn';
import TestAuthProviders from '@/pages/default/test/auth-providers';
import DataSources from '@/pages/default/test/data-sources/index';
import FileUploads from '@/pages/default/test/file-uploads';
import FiltersPage from '@/pages/default/test/filters-page';
import Forms from '@/pages/default/test/forms';
import SchemaPage from '@/pages/default/test/schema-page';
import Translations from '@/pages/default/test/translations';
import HomePage from '@/pages/recipes/home';
import MyRecipeDetailsPage from '@/pages/recipes/my-recipe-details';
import MyRecipeEdit from '@/pages/recipes/my-recipe-edit';
import MyRecipeNew from '@/pages/recipes/my-recipe-new';
import MyRecipeOverviewPage from '@/pages/recipes/my-recipe-overview';
import RecipeDetailsPage from '@/pages/recipes/recipe-details';
import RecipeOverviewPage from '@/pages/recipes/recipe-overview';
import { CustomRouteObject, routes as routesImport } from './routing';

const routeElements: { [key: string]: JSX.Element } = {
  home: (
    <PaperbaseLayout>
      <Suspense>
        <Outlet />
      </Suspense>
    </PaperbaseLayout>
  ),
  // Recipe pages
  homeIndex: <HomePage />,
  recipesIndex: <RecipeOverviewPage />,
  myRecipes: <MyRecipeOverviewPage />,
  myRecipesIndex: <MyRecipeOverviewPage />,
  recipeDetails: <RecipeDetailsPage />,
  myRecipeDetailsIndex: <MyRecipeDetailsPage />,
  myRecipeNew: <MyRecipeNew />,
  myRecipeEdit: <MyRecipeEdit />,
  // Satisfactory pages
  // satisfactoryIndex: <>TEST</>,
  // products: <Products />,
  // recipes: <Recipes />,
  // rawData: <RawData />,
  // generators: <Generators />,
  // buildables: <Buildables />,
  // buildings: <Buildings />,
  // schematics: <Schematics />,
  // belts: <Belts />,
  // miners: <Miners />,
  // resources: <Resources />,
  // calculator: <Calculator />,
  // games: <Games />,
  // Test pages
  testDataSources: <DataSources />,
  testFileUploads: <FileUploads />,
  testAuthProviders: <TestAuthProviders />,
  testForms: <Forms />,
  testTranslations: <Translations />,
  testFilters: <FiltersPage />,
  testSchemas: <SchemaPage />,
  // Default pages
  login: <SignIn mode="signin" />,
  signup: <SignIn mode="signup" />,
  terms: <div>Terms</div>,
  privacy: <div>Privacy</div>,
  '404': <NotFound />,
};

function generateRouteObjects(routes: CustomRouteObject[]): RouteObject[] {
  return routes.map(
    ({
      id: _id,
      Icon: _Icon,
      translationKey: _translationKey,
      category: _category,
      children,
      ...route
    }) => {
      const routeObject: RouteObject = {
        ...route,
        element: route.element ? route.element : routeElements[_id],
      };
      if (children) {
        routeObject.children = generateRouteObjects(children);
      }
      return routeObject;
    }
  );
}

const routes = generateRouteObjects(routesImport);

// export const paths = getAllPaths(routes);
// console.log(paths);

// Function to create a flat list of all paths with custom properties
// export function getAllPaths(routes: CustomRouteObject[], parentPath: string = ''): any[] {
//   return routes.flatMap((route) => {
//     const currentPath = route.path
//       ? `${parentPath}/${route.path}`.replace(/\/+/g, '/')
//       : parentPath;
//     const { children, ...routeInfo } = route;
//     const currentRoute = { ...routeInfo, to: currentPath };
//     const childrenPaths = children ? getAllPaths(children, currentPath) : [];
//     return [currentRoute, ...childrenPaths];
//   });
// }

export default routes;
