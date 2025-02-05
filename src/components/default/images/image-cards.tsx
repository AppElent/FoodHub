import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box, Button, Typography } from '@mui/material';
import { JSX, useState } from 'react';
import ImageCropper from '../../../components/default/images/image-cropper';
import ImageCard from './image-card';

interface ImageCardsProps {
  imageUrls: string[];
  onSave: (files: File[]) => Promise<any>;
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
  showUploadButton?: boolean;
}

const ImageCards = ({
  imageUrls,
  onSave,
  size,
  crop,
  favorite,
  remove,
  showUploadButton = true,
}: ImageCardsProps) => {
  const [cropperUrl, setCropperUrl] = useState<string | undefined>(undefined);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // Determine if these are the first images uploaded
      const filesArray = Array.from(event.target.files);
      if (onSave) {
        await onSave(filesArray);
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

      {/* Upload Button */}
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

      {/* Display Images */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        mt={0}
        justifyContent="flex-start"
      >
        {imageUrls?.map((imageUrl: string) => {
          const isFavorite = favorite
            ? typeof favorite.isFavorite === 'function'
              ? favorite.isFavorite(imageUrl)
              : favorite.isFavorite
            : false;
          return (
            <ImageCard
              key={imageUrl}
              imageUrl={imageUrl}
              onSave={async (file: File) => {
                onSave([file]);
              }}
              showUploadButton={showUploadButton}
              showTitle={false}
              size={size}
              crop={crop}
              favorite={
                favorite
                  ? {
                      action: favorite.action,
                      label: favorite.label,
                      icon: favorite.icon,
                      isFavorite,
                    }
                  : undefined
              }
              remove={remove}
            />
          );
        })}
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

export default ImageCards;
