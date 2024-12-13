import useTabs, { TabOptions } from '@/hooks/use-tabs';
import { Box, BoxProps, Tabs as DefaultTabs, Tab, TabProps, useTheme } from '@mui/material';
import { CurrentTabContext, TabData } from '.';
import TabPanel from './tab-panel';

interface TabsProps {
  tabOptions?: TabOptions;
  tabs: TabData[];
  muiBoxProps?: BoxProps;
  muiTabsProps?: TabsProps;
  muiTabProps?: TabProps;
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const Tabs = ({ tabs, tabOptions, muiBoxProps, muiTabProps, muiTabsProps }: TabsProps) => {
  const theme = useTheme();
  const { tab: currentTab, handleTabChange, setTab } = useTabs(tabs, tabOptions);
  //   const [value, setValue] = React.useState(0);

  return (
    <CurrentTabContext.Provider value={{ tabs, currentTab, handleTabChange, setTab }}>
      <Box
        sx={{ bgcolor: 'background.paper' }}
        {...muiBoxProps}
      >
        <DefaultTabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="secondary"
          textColor="primary"
          aria-label="full width tabs example"
          //centered
          variant="scrollable"
          scrollButtons="auto"
          {...muiTabsProps}
        >
          {tabs?.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
              {...a11yProps(0)}
              {...muiTabProps}
            />
          ))}
        </DefaultTabs>
        {tabs?.map((tab, index) => {
          return (
            <TabPanel
              key={tab.value}
              value={tab.value}
              index={index}
              currentTab={currentTab}
              dir={theme.direction}
            >
              {tab.value === currentTab && tab.component}
            </TabPanel>
          );
        })}
      </Box>
    </CurrentTabContext.Provider>
  );
};

export default Tabs;
