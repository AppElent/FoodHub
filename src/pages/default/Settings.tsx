import { Box, Paper } from '@mui/material';
// import { useState } from 'react';
import useDataQuery from '@/libs/data-sources/use-data-query';
import DefaultPaperbasePage from './DefaultPaperbasePage';

interface Settings {
  test: string;
}

const Settings = () => {
  const settings = useDataQuery<Settings, Settings>({
    queryKey: ['settings'],
  });

  return (
    <DefaultPaperbasePage title="Settings">
      <Box sx={{ flexGrow: 1 }}>
        <Paper sx={{ margin: 'auto', overflow: 'hidden', py: 2, px: 2 }}>
          {JSON.stringify(settings.data)}
          {/* <Button
            onClick={() => {
              settings.actions.set({ test: 'test' }, 'id1');
            }}
          >
            Add data
          </Button> */}
        </Paper>
      </Box>
    </DefaultPaperbasePage>
  );
};

export default Settings;
