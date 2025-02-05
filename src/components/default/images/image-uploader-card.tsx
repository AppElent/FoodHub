import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CropIcon from '@mui/icons-material/Crop';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { JSX, useState } from 'react';
import ImageCropper from '../../../components/default/images/image-cropper';
// import ImageCard from './image-card';

interface ImageCardProps {
  imageUrl: string;
  onUpload: (file: File) => Promise<any>;
  size?: {
    width: number;
    height: number;
  };
  remove?: {
    action: (url: string) => Promise<any>;
    label?: string;
    icon?: JSX.Element;
  };
  crop?: {
    action: (file: File) => Promise<any>;
    // url?: string;
    // setUrl: (url: string) => void;
    label?: string;
    icon?: JSX.Element;
  };
  favorite?: {
    action: (url: string) => Promise<any>;
    label?: string;
    icon?: JSX.Element;
    isFavorite: boolean | ((url: string) => boolean);
  };
  showUploadButton?: boolean;
  showTitle?: boolean;
}

const ImageCard = ({
  imageUrl,
  onUpload,
  size,
  remove,
  crop,
  favorite,
  showTitle = false,
  showUploadButton = true,
}: ImageCardProps) => {
  const [cropperUrl, setCropperUrl] = useState<string | undefined>(undefined);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // Determine if these are the first images uploaded
      const filesArray = Array.from(event.target.files);
      const file = filesArray[0];
      if (onUpload) {
        await onUpload(file);
      }
      // const result = await props.onSave(file);
      // const url = URL.createObjectURL(file);
      // helpers.setValue(url);
    }
  };

  return (
    <Box>
      {/* Display Images */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        mt={3}
        justifyContent="flex-start"
      >
        <Card
          key={imageUrl}
          sx={{ width: size?.width || 300, position: 'relative' }}
        >
          {showTitle && (
            <CardHeader
              title="Image"
              titleTypographyProps={{ variant: 'h6' }}
            />
          )}
          <CardMedia
            component="img"
            height={size?.height || 200}
            image={imageUrl ? imageUrl : '/app/Image_not_available.png'}
            alt="Uploaded Image"
          />
          {showUploadButton && (
            <Button
              variant="contained"
              component="label"
              startIcon={<AddPhotoAlternateIcon />}
              // {...newProps?.muiButtonProps}
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

          {(crop || remove || favorite) && (
            <CardActions style={{ justifyContent: 'flex-end' }}>
              {/* Crop image */}
              {!!crop && (
                <Tooltip
                  title={crop.label || 'Crop Image'}
                  placement="top"
                >
                  <IconButton
                    color="primary"
                    onClick={() => setCropperUrl(imageUrl)}
                    // disabled={image.isDefault}
                  >
                    {crop.icon || <CropIcon />}
                  </IconButton>
                </Tooltip>
              )}

              {/* Set Favorite */}
              {!!favorite && (
                <Tooltip
                  title={favorite.label || 'Set as Favorite'}
                  placement="top"
                >
                  <IconButton
                    // color={image.isDefault ? 'primary' : 'default'}
                    onClick={() => favorite.action(imageUrl)}
                    //disabled={image}
                  >
                    {favorite.icon ||
                      (favorite.isFavorite ? (
                        <StarIcon style={{ color: '#faaf00' }} />
                      ) : (
                        <StarBorderIcon />
                      ))}
                  </IconButton>
                </Tooltip>
              )}

              {/* Delete */}
              {!!remove && (
                <Tooltip
                  title={remove.label || 'Delete'}
                  placement="top"
                >
                  <IconButton
                    color="error"
                    onClick={() => remove.action(imageUrl)}
                    // disabled={image.isDefault}
                  >
                    {remove.icon || <DeleteIcon />}
                  </IconButton>
                </Tooltip>
              )}
            </CardActions>
          )}
        </Card>
      </Box>
      {cropperUrl && (
        <ImageCropper
          dialog={{ isOpen: !!cropperUrl, close: () => setCropperUrl(undefined) }}
          imageUrl={cropperUrl || ''}
          // Filename is same as original URL, but with _cropped appended before the extension
          filename={cropperUrl}
          onSave={async (file, _path) => {
            // const url = URL.createObjectURL(file);
            // helpers.setValue(url);
            // return url;
            return await crop?.action(file);
          }}
          cropperProps={{
            aspect: 16 / 9,
          }}
        />
      )}
    </Box>
  );
};

interface ImageUploaderCardProps {
  imageUrls: string | string[];
  onUpload: (files: File[]) => Promise<any>;
  size?: {
    width: number;
    height: number;
  };
  remove?: {
    action: (url: string) => Promise<any>;
    label?: string;
    icon?: JSX.Element;
  };
  crop?: {
    action: (file: File) => Promise<any>;
    label?: string;
    icon?: JSX.Element;
  };
  favorite?: {
    action: (url: string) => Promise<any>;
    label?: string;
    icon?: JSX.Element;
    isFavorite: boolean | ((url: string) => boolean);
  };
}

const ImageUploaderCard = ({
  imageUrls,
  onUpload,
  size,
  crop,
  favorite,
  remove,
}: ImageUploaderCardProps) => {
  const multiple = Array.isArray(imageUrls);
  const urls = multiple ? imageUrls : [imageUrls];

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // Determine if these are the first images uploaded
      const filesArray = Array.from(event.target.files);
      if (onUpload) {
        await onUpload(filesArray);
      }
    }
  };

  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
      >
        Upload Image
      </Typography>

      {/* Show upload button on top if multiple */}
      {multiple && (
        <Button
          variant="contained"
          component="label"
          startIcon={<AddPhotoAlternateIcon />}
          // {...newProps?.muiButtonProps}
        >
          Upload Images
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleUpload}
          />
        </Button>
      )}

      {/* Display Images */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        mt={0}
        justifyContent="flex-start"
      >
        {urls.map((imageUrl: string) => {
          const favoriteObject = favorite
            ? {
                ...favorite,
                isFavorite:
                  typeof favorite.isFavorite === 'function'
                    ? favorite.isFavorite(imageUrl)
                    : favorite.isFavorite,
              }
            : undefined;
          return (
            <ImageCard
              key={imageUrl}
              imageUrl={imageUrl}
              onUpload={async (file: File) => {
                onUpload([file]);
              }}
              size={size}
              crop={crop}
              favorite={favoriteObject}
              remove={remove}
              showUploadButton={multiple === false}
              showTitle={multiple === false}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ImageUploaderCard;
