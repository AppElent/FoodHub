import { Box, Button } from '@mui/material';
import i18next from 'i18next';
import { showTranslations } from 'translation-check';

const TranslationTestPage = () => {
  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => showTranslations(i18next)}
      >
        Show translations
      </Button>
    </Box>
  );
};

export default TranslationTestPage;
