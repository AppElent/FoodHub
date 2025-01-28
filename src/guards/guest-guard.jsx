import { useAuth } from '@/hooks/use-auth';
import { useRouter } from '@/hooks/use-router';
import { paths } from '@/paths';
import { useCallback, useEffect, useState } from 'react';

export const GuestGuard = (props) => {
  const { children } = props;
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (isAuthenticated) {
      router.replace(paths.dashboard.index);
    } else {
      setChecked(true);
    }
  }, [isAuthenticated, router]);

  // Only check on mount, this allows us to redirect the user manually when auth state changes
  useEffect(
    () => {
      check();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // not authenticated / authorized.

  return <>{children}</>;
};
