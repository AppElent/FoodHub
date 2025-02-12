import { Outlet } from 'react-router-dom';

import Account from '@/pages/default/account';

import { CustomRouteObject } from '@/config/routing';
import PeopleIcon from '@mui/icons-material/People';
import QuizIcon from '@mui/icons-material/Quiz';

const appRoutes: CustomRouteObject[] = [
  {
    id: 'account',
    label: 'Account',
    Icon: <PeopleIcon fontSize="inherit" />,
    category: 'settings',
    path: 'account',
    loginRequired: true,
    element: <Account />,
  },
  {
    id: 'profile',
    label: 'Profile',
    Icon: <PeopleIcon fontSize="inherit" />,
    category: 'settings',
    path: 'profile',
    translationKey: 'common:menu.profile',
    loginRequired: true,
    element: <div>Profile</div>,
  },
  {
    id: 'tests',
    label: 'Tests',
    Icon: <QuizIcon fontSize="inherit" />,
    category: import.meta.env.DEV ? 'settings' : undefined,
    path: 'tests',
    element: <Outlet />,
    children: [
      {
        id: 'testsIndex',
        index: true,
      },
      {
        id: 'testsDetail',
        label: 'Test detail',
        Icon: <QuizIcon />,
        path: ':testId',
      },
    ],
  },
  {
    id: 'terms',
    label: 'Terms and conditions',
    Icon: <PeopleIcon fontSize="inherit" />,
    path: 'terms',
    // element: <div>Terms and conditions</div>,
  },
  {
    id: 'privacy',
    label: 'Privacy statement',
    Icon: <PeopleIcon fontSize="inherit" />,
    path: 'privacy',
    // element: <div>Privacy</div>,
  },
  {
    id: 'login',
    label: 'Login',
    Icon: <PeopleIcon fontSize="inherit" />,
    path: 'login',
    // element: <SignIn mode="signin" />,
  },
  {
    id: 'signup',
    label: 'Signup',
    Icon: <PeopleIcon fontSize="inherit" />,
    path: 'signup',
    // element: <SignIn mode="signup" />,
  },
  {
    id: '404',
    label: '404',
    Icon: <PeopleIcon fontSize="inherit" />,
    path: '*',
    // element: <NotFound />,
  },
];

export default appRoutes;
