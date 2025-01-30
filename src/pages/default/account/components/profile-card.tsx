import ImageCropper from '@/components/default/images/image-cropper';
import FirebaseStorageProvider from '@/libs/storage-providers/providers/FirebaseStorageProvider';
import { CameraAlt as CameraAltIcon } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface ProfileCardProps {
  profile: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
  setProfile: (profile: any) => void;
}

const ProfileCard = ({ profile, setProfile }: ProfileCardProps) => {
  const [cropperUrl, setCropperUrl] = useState<string | null>(null);
  console.log(profile);
  const formik = useFormik({
    initialValues: {
      name: profile?.name,
      email: profile?.email,
      avatar: profile?.avatar,
    },
    onSubmit: async (values: any) => {
      try {
        console.log('Submitting', values);

        //const url = await saveAvatar('avatars', values.avatar, filename);
        await setProfile({
          name: values.name,
          email: values.email,
        });
        toast.success('Profile updated successfully');
      } catch (e) {
        console.error(e);
        toast.error('Error updating profile');
      }
    },
  });

  const saveAvatar = async (folder: string, file: File) => {
    const filename = `${profile.id}__${new Date().toISOString()}.jpg`;
    if (profile.avatar) {
      try {
        const storageProvider = new FirebaseStorageProvider();
        await storageProvider.deleteFile(profile.avatar);
      } catch (e) {
        console.error(e);
      }
    }
    const storageProvider = new FirebaseStorageProvider();
    return await storageProvider.uploadFile(file, `${folder}/${filename}`);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      //const reader = new FileReader();
      setCropperUrl(URL.createObjectURL(file));
      // reader.onload = (e) => {
      //   formik.setFieldValue('avatarUrl', e.target?.result as string);
      // };
      // reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      {cropperUrl && (
        <ImageCropper
          imageUrl={cropperUrl}
          filename="test.jpg"
          onSave={async (file, _path) => {
            //const browserUrl = await URL.createObjectURL(file);
            const url = await saveAvatar('avatars', file);
            setProfile({
              avatar: url,
            });
            formik.setFieldValue('avatar', url);
            return url;
          }}
          dialog={{ isOpen: !!cropperUrl, close: () => setCropperUrl(null) }}
          cropperProps={{
            cropShape: 'round',
            showGrid: false,
          }}
        />
      )}
      <CardHeader title="Profile Settings" />
      <CardContent>
        <Grid
          container
          spacing={2}
          alignItems="center"
        >
          <Grid item>
            <Avatar
              src={formik.values?.avatar}
              alt="Profile Avatar"
              sx={{ width: 100, height: 100 }}
            />
          </Grid>
          <Grid item>
            <input
              accept="image/*"
              id="avatar-upload"
              type="file"
              hidden
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CameraAltIcon />}
              >
                Change Avatar
              </Button>
            </label>
          </Grid>
        </Grid>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          {...formik.getFieldProps('name')}
          margin="normal"
        />
        <TextField
          fullWidth
          disabled
          label="Email"
          variant="outlined"
          {...formik.getFieldProps('email')}
          margin="normal"
        />
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={(_e) => formik.handleSubmit()}
          disabled={formik.isSubmitting || !formik.dirty || !formik.isValid}
        >
          Save Changes
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProfileCard;
