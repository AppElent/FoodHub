import useIsMobile from '@/hooks/use-is-mobile';
import { Recipe } from '@/schemas/recipe';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useState } from 'react';

interface RecipeCarrousselProps {
  recipes: Recipe[];
}

const RecipeCarroussel = ({ recipes }: RecipeCarrousselProps) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const isMobile = useIsMobile();

  const handleCarouselNext = () => {
    setCarouselIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  const handleCarouselPrev = () => {
    setCarouselIndex((prevIndex) => (prevIndex - 1 + recipes.length) % recipes.length);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${recipes[carouselIndex]?.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: { xs: '300px', sm: '400px' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        position: 'relative',
      }}
    >
      <Typography
        variant={isMobile ? 'h4' : 'h2'}
        component="h1"
        sx={{ mb: 2, textAlign: 'center', px: 2 }}
      >
        {recipes[carouselIndex]?.name}
      </Typography>
      {/* <TextField
        placeholder="What do you want to eat today?"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          width: { xs: '80%', sm: '50%' },
          backgroundColor: 'rgba(255,255,255,0.8)',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'transparent',
            },
            '&:hover fieldset': {
              borderColor: 'transparent',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'transparent',
            },
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      /> */}
      <IconButton
        sx={{
          position: 'absolute',
          left: 20,
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
          boxShadow: 3,
        }}
        onClick={handleCarouselPrev}
      >
        <ChevronLeft />
      </IconButton>
      <IconButton
        sx={{
          position: 'absolute',
          right: 20,
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
          boxShadow: 3,
        }}
        onClick={handleCarouselNext}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default RecipeCarroussel;
