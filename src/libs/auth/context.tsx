import PropTypes from 'prop-types';
import { useCallback, useEffect, useReducer } from 'react';
import { AuthContext, initialState } from './contextState';

//const TemplateProvider = new IAuthProvider({ login: '/login', logout: '/logout' });

export const AuthConsumer = AuthContext.Consumer;

const reducer = (state: any, action: any) => {
  if (action.type === 'AUTH_STATE_CHANGED') {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  return state;
};

export const AuthProvider = (props: any) => {
  const { provider, children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  //const router = useRouter();

  const handleAuthStateChanged = useCallback(
    async (user: any) => {
      console.log('User authentication changed', { user, provider });
      if (user) {
        // Here you should extract the complete user profile to make it available in your entire app.
        // The auth state only provides basic information.
        dispatch({
          type: 'AUTH_STATE_CHANGED',
          payload: {
            isAuthenticated: true,
            user: await provider.getCurrentUser(),
          },
        });
      } else {
        dispatch({
          type: 'AUTH_STATE_CHANGED',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
        //router.replace(provider?.paths?.login || '/');
      }
    },
    [provider]
  );

  useEffect(
    () => provider.onAuthStateChanged(handleAuthStateChanged)(),
    [provider, handleAuthStateChanged]
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: provider.provider,
        signUp: provider.signUp,
        signInWithEmailAndPassword: provider.signIn,
        signInWithGoogle: provider.signInWithGoogle,
        signOut: provider.signOut,
        getCurrentUser: provider.getCurrentUser,
        updateProfile: provider.updateProfile,
        updatePassword: provider.updatePassword,
        resetPassword: provider.resetPassword,
        options: provider.options,
        provider,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  provider: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};
