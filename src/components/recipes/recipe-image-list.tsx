import { ImageList, ImageListItem } from '@mui/material';

const RecipeImageList = ({
  images,
  setSelectedImage,
}: {
  images: string[];
  setSelectedImage: (image: string) => void;
}) => {
  return (
    <ImageList
      cols={images?.length}
      gap={8}
      rowHeight={160}
    >
      {images.map((src: string, index: number) => (
        <ImageListItem key={index}>
          <img
            src={src}
            alt={`Image ${index + 1}`}
            loading="lazy"
            onClick={() => setSelectedImage(src)}
            style={{
              width: 150,
              height: 150,
              objectFit: 'cover',
              cursor: 'pointer',
            }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default RecipeImageList;
