import { AppConfig, setLogLevel } from '@/config';
import useAuth from '@/libs/auth/use-auth';
import { Button, Card, CardActions, CardContent, CardHeader, Grid } from '@mui/material';
import DefaultPage from '../DefaultPage';
import DebugCard from './components/debug-card';
import PasswordCard from './components/password-card';
import ProfileCard from './components/profile-card';

const Account = () => {
  const auth = useAuth({ redirectUnauthenticated: true });
  // const formik = useCustomFormik({
  //   initialValues: {
  //     email: '',
  //     password: '',
  //   },
  //   onSubmit: async (values) => {
  //     console.log('submit', values);
  //   },
  // });

  return (
    <DefaultPage>
      <Grid
        container
        spacing={3}
        className="p-4"
      >
        <Grid
          item
          xs={12}
          md={6}
        >
          {auth?.user && (
            <ProfileCard
              profile={auth.user}
              setProfile={async (values) => await auth.updateProfile?.(values)}
            />
          )}
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
        >
          <PasswordCard
            setPassword={async (oldPassword, newPassword) => {
              await auth.updatePassword?.(oldPassword, newPassword);
            }}
          />
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
        >
          <DebugCard
            setDebug={(level: AppConfig['settings']['logLevel']) => {
              setLogLevel(level);
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
        >
          <Card>
            <CardHeader title="User" />
            <CardContent> Current user: {auth.user?.email}</CardContent>
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={() => {
                  auth.signOut();
                }}
              >
                Logout
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </DefaultPage>
  );
};

export default Account;
