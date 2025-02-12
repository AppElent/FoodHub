import { setPageTitleSuffix } from '@/components/default/seo';
import { SplashScreen } from '@/components/default/splash-screen';
import config from '@/config';
import { dataSources } from '@/config/datasources';
import useHttpsRedirect from '@/hooks/use-https-redirect';
import '@/libs/i18n';
import defaultRoutes from '@/routes/defaultRoutes';
import { Theme, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfirmProvider } from 'material-ui-confirm';
import { FC, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import ErrorBoundary from './components/default/error-boundary';
import { queryClient } from './config/datasources';
import useRouter from './hooks/use-router';
import { AuthConsumer, AuthProvider } from './libs/auth/context';
import DataProvider from './libs/data-sources/DataProvider';

interface DashboardProps {
  theme: Theme;
  routes?: any[];
  authProvider?: any;
}

const Dashboard: FC<DashboardProps> = ({ theme, routes, authProvider }) => {
  //const { theme, routes, authProvider, dataSources } = props;
  // Redirect to HTTPS
  useHttpsRedirect(config?.paths?.httpsRedirect || false);

  // Custom redirect from root page
  const navigate = useRouter();
  useEffect(() => {
    if (config?.paths?.rootRedirect && window.location.pathname === '/')
      navigate.push(config.paths.rootRedirect);
  }, [navigate]);

  // Initialize routes
  const element = useRoutes(routes || defaultRoutes);

  // Set HTML page title suffix
  if (config?.meta?.title) setPageTitleSuffix(config?.meta?.title);
  return (
    <>
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <AuthProvider provider={authProvider}>
            <AuthConsumer>
              {(auth) => {
                // Check if splashscreen should be shown
                const showSlashScreen = !auth.isInitialized;
                if (showSlashScreen) return <SplashScreen />;

                return (
                  <>
                    <QueryClientProvider client={queryClient}>
                      <ReactQueryDevtools
                        initialIsOpen={false}
                        buttonPosition="bottom-left"
                      />
                      <DataProvider dataSources={dataSources || {}}>
                        <QueryParamProvider adapter={ReactRouter6Adapter}>
                          <ConfirmProvider>
                            <ToastContainer
                              position="top-right"
                              autoClose={2500}
                              hideProgressBar={false}
                              newestOnTop={false}
                              closeOnClick
                              rtl={false}
                              pauseOnFocusLoss
                              draggable
                              pauseOnHover
                              theme="light"
                              transition={Bounce}
                            />
                            {element}
                          </ConfirmProvider>
                        </QueryParamProvider>
                      </DataProvider>
                    </QueryClientProvider>
                  </>
                );
              }}
            </AuthConsumer>
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </>
  );
};

export default Dashboard;
