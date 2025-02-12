import useAuth from '@/libs/auth/use-auth';
import FirebaseStorageProvider from '@/libs/storage-providers/providers/FirebaseStorageProvider';
import { Box, Card, CardContent, CardHeader, Grid } from '@mui/material';
import ImageUploaderCard from './_components/image-uploader-card';
import SimpleCropper from './_components/simple-cropper';

interface CardLayoutProps {
  title: string;
  children: React.ReactNode;
}

const CardLayout = ({ title, children }: CardLayoutProps) => {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>{children}</CardContent>
    </Card>
  );
};

const FileUploadsTestPage = () => {
  const storageClass = new FirebaseStorageProvider({} as any, { instance: {} });
  const auth = useAuth();

  return (
    <Box>
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
          md={6}
        >
          <CardLayout title="Image uploader with cropping and thumbnail">
            <ImageUploaderCard
              title="Image uploader with cropping and thumbnail"
              uploadFile={storageClass.uploadFile}
              uploadOriginal={true}
              uploadCropped={true}
              uploadThumbnail={true}
              originalFileName={`uploads/test/${auth.user?.id || 'unknown'}/original/testimage.jpg`}
              croppedFileName={`uploads/test/${auth.user?.id || 'unknown'}/cropped/testimage.jpg`}
              thumbnailFileName={`uploads/test/${auth.user?.id || 'unknown'}/thumbnail/testimage.jpg`}
            />
          </CardLayout>
        </Grid>
        <Grid item>
          <CardLayout title="Simple Cropper">
            <SimpleCropper
              filename={`uploads/test/${auth.user?.id || 'unknown'}/simplecropper/testimage.jpg`}
            />
          </CardLayout>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FileUploadsTestPage;
