import useDeepCompareMemo from '@/hooks/use-deep-compare-memo';
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './contextState';

interface UseAuthOptions {
  redirectUnauthenticated?: boolean;
}

const useAuth = (options?: UseAuthOptions) => {
  const context = useContext(AuthContext);
  const stableOptions = useDeepCompareMemo<UseAuthOptions>(options);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!context.isAuthenticated && stableOptions?.redirectUnauthenticated) {
      const searchParams = new URLSearchParams({ returnTo: location.pathname });
      navigate(`${context.options?.login}?${searchParams.toString()}`);
    }
  }, [context, navigate, stableOptions, location.pathname]);

  return context;
};

export default useAuth;
