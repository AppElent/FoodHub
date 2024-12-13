import ScrollToTop from '@/components/default/scroll-to-top';
import '@/config/firebase';
import { db } from '@/config/firebase';
import routes from '@/config/routes';
import { FirebaseAuthProvider } from '@/libs/auth';
import FirestoreDataSource from '@/libs/data-sources/data-sources/FirestoreDataSource';
import LocalStorageDataSource from '@/libs/data-sources/data-sources/LocalStorageDataSource';

import { recipeYupSchema } from '@/schemas/recipe';
import theme from '@/theme/paperbase/theme';
import './App.css';
import config from './config';
import { getPath } from './config/paths';
import Dashboard from './Dashboard';
import { Recipe } from './schemas/recipe';

const firebaseProvider = new FirebaseAuthProvider({
  login: getPath('login').to,
  logout: '/logout',
});

const devFilter = import.meta.env.DEV ? 'ja' : 'ZMG16rhpzbdKd8LXUIiNOD7Jul23';

const dataSources = {
  recipes: new FirestoreDataSource<Recipe>(
    {
      target: 'recipes',
      targetMode: 'collection',
      YupValidationSchema: recipeYupSchema,
      subscribe: true,
      targetFilter: {
        filters: [{ field: 'owner', operator: '!=', value: devFilter }],
        orderBy: [{ field: 'name', direction: 'asc' }],
      },
    },
    { db }
  ),
  settings: new LocalStorageDataSource({ target: 'settings', targetMode: 'document' }),
};

function App() {
  console.log('App config', firebaseProvider, dataSources, routes, config);
  return (
    <>
      <ScrollToTop />

      <Dashboard
        theme={theme}
        authProvider={firebaseProvider}
        routes={routes}
        dataSources={dataSources}
      />
    </>
  );
}

export default App;
