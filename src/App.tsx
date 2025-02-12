import ScrollToTop from '@/components/default/scroll-to-top';
import '@/config/firebase';
import routes from '@/config/routes';

import theme from '@/theme/paperbase/theme';
import './App.css';
import config from './config';
import { getPath } from './config/paths';
import Dashboard from './Dashboard';
import FirebaseAuthProvider from './libs/auth/auth-providers/FirebaseAuthProvider';

const firebaseProvider = new FirebaseAuthProvider({
  login: getPath('login').to,
  logout: '/logout',
});

function App() {
  console.log('App config', firebaseProvider, routes, config);
  return (
    <>
      <ScrollToTop />

      <Dashboard
        theme={theme}
        authProvider={firebaseProvider}
        routes={routes}
      />
    </>
  );
}

export default App;
