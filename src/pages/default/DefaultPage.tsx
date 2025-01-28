import CustomBreadcrumbs from '@/components/default/custom-breadcrumbs';
import { Seo } from '@/components/default/seo';
import { useCurrentPath } from '@/config/paths';
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
  const path = useCurrentPath();
  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4, bgcolor: '#F9F9F9', minHeight: '100vh' }}
    >
      <Seo title={path?.label} />
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
