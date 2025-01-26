import CustomBreadcrumbs from '@/components/default/custom-breadcrumbs';
import { Container } from '@mui/material';
import { ComponentProps } from 'react';

interface DefaultPageProps {
  // currentPage?: string;
  // switchOptions?: {
  //   label: string;
  //   key: string;
  // }[];
  options?: ComponentProps<typeof CustomBreadcrumbs>['options'];
  children?: React.ReactNode;
}

const DefaultPage = ({ options, children }: DefaultPageProps) => {
  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, bgcolor: '#F9F9F9', minHeight: '100vh' }}
    >
      <CustomBreadcrumbs
        // currentPage={currentPage}
        // switchOptions={switchOptions}
        options={options}
      />
      {children}
    </Container>
  );
};

export default DefaultPage;
