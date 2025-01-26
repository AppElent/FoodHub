import { createContext } from 'react';
import { AuthState, User } from '.';

export const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  raw: null,
  options: { login: null },
  provider: null,
  signIn: async () => ({}) as User,
  signUp: async () => ({}) as User,
  signOut: async () => {},
  //...TemplateProvider
  // signUp: (_email: string, _password: string) => Promise<User>,
  // signInWithEmailAndPassword: async () => Promise<void>,
  // signInWithGoogle: async () => Promise<void>,
  // signOut: async () => any,
};

export const AuthContext = createContext<AuthState>({
  ...initialState,
  // provider: 'FIREBASE',
  // createUserWithEmailAndPassword: () => Promise.resolve(),
  // signInWithEmailAndPassword: () => Promise.resolve(),
  // signInWithGoogle: () => Promise.resolve(),
  // signOut: () => Promise.resolve(),
});
