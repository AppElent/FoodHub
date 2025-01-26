import useDeepCompareMemo from '@/hooks/use-deep-compare-memo';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './contextState';

interface UseAuthOptions {
  redirectUnauthenticated?: boolean;
}

const useAuth = (options?: UseAuthOptions) => {
  const context = useContext(AuthContext);
  const stableOptions = useDeepCompareMemo<UseAuthOptions>(options);
  const navigate = useNavigate();

  useEffect(() => {
    if (!context.isAuthenticated && stableOptions?.redirectUnauthenticated) {
      navigate(context.options?.login);
    }
  }, [context, navigate, stableOptions]);

  return context;
};

export default useAuth;
