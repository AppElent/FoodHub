import CustomBreadcrumbs from '@/components/default/custom-breadcrumbs';
import { Container } from '@mui/material';

const DefaultPage = ({ currentPage, children }: any) => {
  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, bgcolor: '#F9F9F9', minHeight: '100vh' }}
    >
      <CustomBreadcrumbs currentPage={currentPage} />
      {children}
    </Container>
  );
};

export default DefaultPage;
