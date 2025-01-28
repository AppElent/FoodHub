import { Seo } from '@/components/default/seo';
import TabSection from '@/components/default/tab-section';
import config from '@/config';
import HelpIcon from '@mui/icons-material/Help';
import { AppBar, Box, Button, Grid, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
//import { OPTIONS } from '../../App';

const lightColor = 'rgba(255, 255, 255, 0.7)';

interface DefaultPaperbasePageProps {
  title: string;
  tabs?: any;
  buttons?: any;
  children: any;
}

const DefaultPaperbasePage = ({ title, tabs, buttons, children }: DefaultPaperbasePageProps) => {
  return (
    <>
      <Seo title={title} />
      <AppBar
        component="div"
        color="primary"
        position="static"
        elevation={0}
        sx={{ zIndex: 0 }}
      >
        <Toolbar>
          <Grid
            container
            spacing={1}
            sx={{ alignItems: 'center' }}
          >
            <Grid
              item
              xs
            >
              <Typography
                color="inherit"
                variant="h5"
                component="h1"
              >
                {title}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                sx={{ borderColor: lightColor }}
                variant="outlined"
                color="inherit"
                onClick={() => {
                  config?.issueDialog?.open(); //TODO: rework
                }}
                size="small"
              >
                Submit issue
              </Button>
            </Grid>
            <Grid item>
              <Tooltip title="Help">
                <IconButton color="inherit">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {(tabs || buttons) && (
        <TabSection
          tabs={tabs}
          buttons={buttons}
        ></TabSection>
      )}

      <Box
        component="main"
        sx={{ flex: 1, py: 4, px: 6, bgcolor: '#eaeff1' }}
      >
        {children}
      </Box>
    </>
  );
};

export default DefaultPaperbasePage;
