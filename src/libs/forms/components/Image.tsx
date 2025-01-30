import { FieldConfig } from '@/libs/forms';
import useFormField from '@/libs/forms/use-form-field';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  IconButton,
  Tooltip,
} from '@mui/material';
import _ from 'lodash';
import { JSX, useState } from 'react';
import ImageCropper from '../../../components/default/images/image-cropper';

type Action = {
  icon: JSX.Element;
  label: string;
  action?: (url: string) => void;
};

type SpecificActions = {
  crop?: {
    icon?: JSX.Element;
    label?: string;
    action?: (url: string) => void;
  };
  delete: {
    icon?: JSX.Element;
    label?: string;
    action?: (url: string) => void;
  };
  favorite: {
    icon?: JSX.Element;
    isFavorite?: boolean;
    label?: string;
    action: (url: string) => void;
  };
}; //TODO: fix

type ActionObject = SpecificActions & {
  [key: string]: Action;
};

interface ImageProps {
  name?: string;
  field?: FieldConfig;
  uploadImage?: (file: File) => Promise<string>;
  deleteImage?: (url: string) => Promise<void>;
  postProcess?: () => Promise<any>;
  getFavorite?: (url: string) => boolean;
  setFavorite?: (url: string) => void;
  cropImage?: (url: string) => Promise<string>;
  actions?: {
    id: string;
    icon: JSX.Element;
    label: string;
    action: (url: string) => void;
  }[];
  actionObject?: ActionObject;
  showUploadButton?: boolean;
}

const Image = ({
  name,
  field: fieldConfig,
  actions = [],
  showUploadButton = true,
  deleteImage,
  cropImage,
  ...props
}: ImageProps) => {
  if (!name && !fieldConfig) {
    throw new Error('Either name or field must be provided');
  }
  const fieldName = name || fieldConfig?.name;
  const data = useFormField(fieldName as string, fieldConfig);
  const { options, field, helpers } = data;
  const [cropperUrl, setCropperUrl] = useState<string | undefined>(undefined);

  const newProps = _.merge({}, options, props);

  const image = field.value || '';

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // Determine if these are the first images uploaded
      const filesArray = Array.from(event.target.files);
      const file = filesArray[0];
      const url = URL.createObjectURL(file);
      helpers.setValue(url);
    }
  };

  // const handleDelete = (id: string) => {
  //   if (deleteImage) {
  //     deleteImage(id);
  //   }
  //   helpers.setValue('');
  // };

  return (
    <Box>
      {/* <Typography
        variant="h6"
        gutterBottom
      >
        Upload Image
      </Typography>

      {/* Upload Button */}
      {/* <Button
        variant="contained"
        component="label"
        startIcon={<AddPhotoAlternateIcon />}
        {...newProps?.muiButtonProps}
      >
        Upload Image
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleUpload}
        />
      </Button> */}

      {/* Display Images */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        mt={3}
        justifyContent="flex-start"
      >
        <Card
          key={image}
          sx={{ width: 300, position: 'relative' }}
        >
          <CardHeader
            title="Image"
            titleTypographyProps={{ variant: 'h6' }}
          />
          <CardMedia
            component="img"
            height="200"
            image={image ? image : '/app/Image_not_available.png'}
            alt="Uploaded Image"
          />
          {showUploadButton && (
            <Button
              variant="contained"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
              {...newProps?.muiButtonProps}
              sx={{
                position: 'absolute',
                top: 70,
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
              }}
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleUpload}
              />
            </Button>
          )}
          {actions?.length > 0 && (
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              {actions.map((action) => (
                <Tooltip
                  key={action.id}
                  title={action.label}
                  placement="top"
                >
                  <IconButton
                    onClick={() => action.action(image)}
                    // disabled={image.isDefault}
                  >
                    {action.icon}
                  </IconButton>
                </Tooltip>
                // <Button
                //   key={action.id}
                //   onClick={() => action.action(image)}
                // >
                //   {action.icon}
                //   {action.label}
                // </Button>
              ))}
            </CardActions>
          )}
          {/* <CardActions style={{ justifyContent: 'flex-end' }}> */}
          {/* Crop image */}
          {/* {!!cropImage && (
              <Tooltip
                title="Crop Image"
                placement="top"
              >
                <IconButton
                  color="primary"
                  onClick={() => setCropperUrl(image)}
                  // disabled={image.isDefault}
                >
                  <CropIcon />
                </IconButton>
              </Tooltip>
            )} */}

          {/* Set Favorite
            {getFavorite && (
              <Tooltip
                title="Set as Favorite"
                placement="top"
              >
                <IconButton
                  // color={image.isDefault ? 'primary' : 'default'}
                  onClick={() => handleSetFavorite(image)}
                  //disabled={image}
                >
                  {getFavorite(image) ? (
                    <StarIcon style={{ color: '#faaf00' }} />
                  ) : (
                    <StarBorderIcon />
                  )}
                </IconButton>
              </Tooltip>
            )} */}

          {/* Delete */}
          {/* {deleteImage && (
              <Tooltip
                title="Delete"
                placement="top"
              >
                <IconButton
                  color="error"
                  onClick={() => handleDelete(image)}
                  // disabled={image.isDefault}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )} */}
          {/* </CardActions> */}
        </Card>
      </Box>
      {cropperUrl && (
        <ImageCropper
          dialog={{ isOpen: !!cropperUrl, close: () => setCropperUrl(undefined) }}
          imageUrl={cropperUrl || ''}
          // Filename is same as original URL, but with _cropped appended before the extension
          filename={cropperUrl}
          onSave={async (file, _path) => {
            // const url = await uploadImage(file);
            // const newValue = field.value || [];
            // helpers.setValue([...newValue, url]);
            // setCropperUrl(undefined);
            // return url;
            const url = URL.createObjectURL(file);
            helpers.setValue(url);
            return url;
          }}
          cropperProps={{
            aspect: 16 / 9,
          }}
        />
      )}
    </Box>
  );
};

export default Image;
