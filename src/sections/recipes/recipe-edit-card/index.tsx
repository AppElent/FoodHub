import ImageUploaderCard from '@/components/default/images/image-uploader-card';
import JsonEditor from '@/components/default/json-editor';
import GridLayout from '@/components/default/ui/grid-layout';
import LoadingButton from '@/components/default/ui/loading-button';
import { getLogLevel } from '@/config';
import useKeyboardShortcut from '@/hooks/use-keyboard-shortcut';
import usePathRouter from '@/hooks/use-path-router';
import useQueryParamAction from '@/hooks/use-query-param-action';
import useAuth from '@/libs/auth/use-auth';
import { CustomForm } from '@/libs/forms';
import AutocompleteChipList from '@/libs/forms/components/AutocompleteChipList';
import CancelButton from '@/libs/forms/components/CancelButton';
import Errors from '@/libs/forms/components/Errors';
import Images from '@/libs/forms/components/Images';
import JsonTextField from '@/libs/forms/components/JsonTextField';
import List from '@/libs/forms/components/List';
import Rating from '@/libs/forms/components/Rating';
import SubmitButton from '@/libs/forms/components/SubmitButton';
import TextField from '@/libs/forms/components/TextField';
import useCustomFormik from '@/libs/forms/use-custom-formik';
import FirebaseStorageProvider from '@/libs/storage-providers/providers/FirebaseStorageProvider';
import { createRecipeSchema, Recipe, recipeYupSchema } from '@/schemas/recipes/recipe';
import useDataHelper from '@/schemas/use-data-helper';
import { Box, Button, CardActions, Grid, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RecipeEditCardProps {
  recipe?: Recipe | null;
  //saveRecipe: (recipe: Recipe, id: string) => Promise<Recipe>;
}

interface externalDataActionInterface {
  loading: boolean;
  error: string | null;
}

const RecipeEditCard = ({ recipe }: RecipeEditCardProps) => {
  const auth = useAuth({ redirectUnauthenticated: true });
  // Translation
  const { t } = useTranslation();
  // Recipe data
  const {
    data: recipes,
    setItem: setRecipe,
    updateItem: updateRecipe,
    deleteItem: deleteRecipe,
  } = useDataHelper<Recipe>('recipes', { label: t('foodhub:defaults.recipe') });
  // Loading external data state
  const [externalDataAction, setExternalDataAction] = useState<externalDataActionInterface>({
    loading: false,
    error: null,
  });
  // Save using CTRL-S
  useKeyboardShortcut('s', () => formik.handleSubmit());

  // If formik.values.owner is set, it should be the same as currentuser
  useEffect(() => {
    if (
      auth.user &&
      formik.values.owner &&
      formik.values.owner !== auth.user.id &&
      formik.values.owner !== ''
    ) {
      router.push('recipes');
    }
  });

  const initialValues = useMemo(() => {
    const recipeValues = recipe || createRecipeSchema().getTemplate();
    return {
      ...recipeValues,
      owner: auth.user?.id,
    };
  }, [auth.user, recipe]);

  // Get formik instance ref
  const formik = useCustomFormik({
    initialValues,
    validationSchema: recipeYupSchema,
    enableReinitialize: true,
    onSubmit: async (values: Recipe) => {
      // Save data
      await setRecipe(values, values.id);
      const recipeId = values.id;

      const filesToUpload = formik.values.images.filter((url: string) => url.startsWith('blob:'));
      if (filesToUpload.length > 0) {
        const storageClass = new FirebaseStorageProvider();
        for (const url of filesToUpload) {
          const blob = await fetch(url).then((r) => r.blob());
          const filename = url.split('/').pop();
          const file = new File([blob], filename || 'file', { type: blob.type });

          const imageUrl = await storageClass.uploadFile(
            file,
            `uploads/recipes/${recipeId}/${filename}`
          );
          // Replace blob url in images with real url
          values.images = [...formik.values.images.filter((img: string) => img !== url), imageUrl];

          // If image is the same as the one being uploaded, replace it
          if (values.image === url) {
            values.image = imageUrl;
          }
        }
      }

      // If values.image is a blob url, upload it
      if (values.image && values.image.startsWith('blob:')) {
        const storageClass = new FirebaseStorageProvider();
        const blob = await fetch(values.image).then((r) => r.blob());
        const filename = values.image.split('/').pop();
        const file = new File([blob], filename || 'file', { type: blob.type });

        const imageUrl = await storageClass.uploadFile(
          file,
          `uploads/recipes/${recipeId}/${filename}`
        );
        values.image = imageUrl;
      }

      // Redirect to recipe page
      router.push('myRecipeDetails', { recipeId: recipeId });
      //onClose();
    },
  });

  const fetchExternalData = useCallback(
    async (url: string) => {
      if (url) {
        setExternalDataAction({ loading: true, error: null });
        try {
          const recipeData = await createRecipeSchema().fetchExternalData(url);
          formik.setValues({
            ...formik.values,
            ...recipeData,
          });
        } catch (e: any) {
          console.error(e);
          setExternalDataAction({ loading: false, error: e.message });
        } finally {
          setExternalDataAction({ loading: false, error: externalDataAction.error });
        }
      }
    },
    [externalDataAction.error, formik]
  );

  // Receive url query param and fetch recipe data
  useQueryParamAction('url', (url) => {
    const fetchDataAndUpdateFormik = async () => {
      await formik.setFieldValue('url', url);
      await fetchExternalData(url);
      //await fetchData(`https://api-python.appelent.site/recipes/scrape?url=${url}`);
    };
    if (url && formik.values.url !== url && !externalDataAction.loading) {
      //TODO: check if valid url using formik
      fetchDataAndUpdateFormik();
    }
  });

  useEffect(() => {
    console.log('FORMIK', formik);
  }, [formik.values]);

  // Router instance
  const router = usePathRouter();

  // Delete all images that are uploaded to firebasestorage
  const deleteRecipeAndImages = async (recipeId: string) => {
    const storageClass = new FirebaseStorageProvider();

    // Check images and image url
    const images = recipe?.images || [];
    if (recipe?.image) {
      images.push(recipe.image);
    }
    for (const url of images) {
      // Check if image url is manually uploaded to firebasestorage
      if (url?.startsWith('https://firebasestorage.googleapis.com')) {
        await storageClass.deleteFile(url);
      }
    }
    await deleteRecipe(recipeId);
  };

  // Get fields and suggestions
  const fields = useMemo(() => createRecipeSchema().getFieldDefinitions(), []);
  const keywordSuggestions = useMemo(
    () => recipes && createRecipeSchema().getKeywordsSuggestions(recipes),
    [recipes]
  );
  const cuisineSuggestions = useMemo(
    () => recipes && createRecipeSchema().getCuisineSuggestions(recipes),
    [recipes]
  );

  const saveImages = async (files: File[]) => {
    const currentImages = recipe ? recipe.images : formik.values.images;

    if (recipe) {
      const storageClass = new FirebaseStorageProvider();
      const urls = await Promise.all(
        files.map(async (file) => {
          return await storageClass.uploadFile(file, `uploads/recipes/${recipe.id}/${file.name}`);
        })
      );
      const newImages = Array.from(new Set([...currentImages, ...urls]));
      updateRecipe(
        {
          images: newImages,
          image: recipe.image && recipe.image !== '' ? recipe.image : urls[0],
        },
        recipe.id
      );
    } else {
      const urls = files.map((file) => URL.createObjectURL(file));
      if (!formik.values.image) {
        formik.setFieldValue('image', urls[0]);
      }

      const newImages = Array.from(new Set([...currentImages, ...urls]));
      console.log(currentImages);
      formik.setFieldValue('images', newImages);
    }
  };

  const images = useMemo(() => {
    const allImages = recipe ? recipe.images || [] : formik.values.images || [];
    const image = recipe ? recipe.image : formik.values.image;
    if (image && image !== '' && !allImages.includes(image)) {
      allImages.push(image);
    }
    return allImages;
  }, [recipe, formik.values.images, formik.values.image]);

  return (
    <>
      {fields && (
        <CustomForm
          formik={formik}
          options={{
            debounce: 300,
            muiTextFieldProps: {
              fullWidth: true,
              variant: 'outlined',
              multiline: true,
            },
          }}
        >
          <ImageUploaderCard
            imageUrls={images}
            onUpload={async (files) => {
              await saveImages(files);
            }}
            size={{
              width: 150,
              height: 100,
            }}
            remove={{
              action: async (url: string) => {
                const currentImage = recipe ? recipe.image : formik.values.image;
                const currentImages = recipe ? recipe.images : formik.values.images;
                const newImages = currentImages.filter((img: string) => img !== url);
                const newImage = currentImage === url ? newImages[0] : currentImage;
                if (url.startsWith('blob:')) {
                  URL.revokeObjectURL(url);
                } else if (url.startsWith('https://firebasestorage.googleapis.com')) {
                  try {
                    const storageClass = new FirebaseStorageProvider();
                    await storageClass.deleteFile(url);
                  } catch (e) {
                    console.error(e);
                  }
                }
                if (recipe) {
                  updateRecipe(
                    {
                      images: newImages,
                      image: newImage,
                    },
                    recipe.id
                  );
                } else {
                  formik.setFieldValue('images', newImages);
                  formik.setFieldValue('image', newImage);
                }
              },
            }}
            favorite={{
              action: async (url: string) => {
                const images = recipe ? recipe.images : formik.values.images;
                const currentImage = recipe ? recipe.image : formik.values.image;
                const newImages =
                  currentImage !== '' ? Array.from(new Set([...images, currentImage])) : images;
                if (currentImage !== url) {
                  formik.setFieldValue('image', url);
                  formik.setFieldValue('images', newImages);
                  if (recipe) {
                    updateRecipe(
                      {
                        image: url,
                        images: newImages,
                      },
                      recipe.id
                    );
                  }
                }
              },
              isFavorite: (url: string) => {
                return recipe ? recipe.image === url : formik.values.image === url;
              },
            }}
            crop={{
              action: async (file: File) => {
                await saveImages([file]);
              },
            }}
          />
          {/* <ImageUploaderCard
            imageUrls={formik.values.image}
            onUpload={async (files) => {
              await saveImages(files);
            }}
          /> */}

          {/* <ImageCards
            imageUrls={formik.values.images}
            onSave={async (files) => {
              await saveImages(files);
            }}
            showUploadButton={false}
            size={{
              width: 150,
              height: 100,
            }}
            crop={{
              action: async (file: File) => {
                await saveImages([file]);
              },
            }}
            remove={{
              action: async (url: string) => {
                const newImages = formik.values.images.filter((img: string) => img !== url);
                if (url.startsWith('blob:')) {
                  URL.revokeObjectURL(url);

                  if (recipe) {
                    updateRecipe(
                      {
                        images: newImages,
                      },
                      recipe.id
                    );
                  } else {
                    formik.setFieldValue('images', newImages);
                  }
                  // formik.setFieldValue('image', '');
                } else if (url.startsWith('https://firebasestorage.googleapis.com')) {
                  try {
                    const storageClass = new FirebaseStorageProvider();
                    await storageClass.deleteFile(url);
                  } catch (e) {
                    console.error(e);
                  }
                  if (recipe) {
                    updateRecipe(
                      {
                        images: newImages,
                      },
                      recipe.id
                    );
                  } else {
                    formik.setFieldValue('images', newImages);
                  }
                }
              },
            }}
            favorite={{
              action: async (url: string) => {
                if (recipe && recipe.image !== url) {
                  updateRecipe(
                    {
                      image: url,
                      images:
                        recipe.image && recipe.image !== ''
                          ? [...recipe.images, recipe.image]
                          : recipe.images,
                    },
                    recipe.id
                  );
                } else if (formik.values.image !== url) {
                  const newImages = formik.values.image
                    ? [...formik.values.images, formik.values.image]
                    : formik.values.images;
                  formik.setFieldValue('image', url);
                  formik.setFieldValue('images', newImages);
                }
              },
              isFavorite: (url: string) => {
                return formik.values.image === url;
              },
            }}
          /> */}
          {/* <ImageCard
            imageUrl={recipe ? recipe.image : formik.values.image}
            onSave={async (file) => {
              console.log('Saving file ' + file.name);
              await saveImage(file);
            }}
            crop={{
              action: async (file: File) => {
                await saveImage(file);
              },
            }}
            remove={{
              action: async (url: string) => {
                if (url.startsWith('blob:')) {
                  URL.revokeObjectURL(url);
                  if (recipe) {
                    updateRecipe(
                      {
                        image: '',
                      },
                      recipe.id
                    );
                  } else {
                    formik.setFieldValue('image', '');
                  }
                  // formik.setFieldValue('image', '');
                } else if (url.startsWith('https://firebasestorage.googleapis.com')) {
                  const storageClass = new FirebaseStorageProvider();
                  await storageClass.deleteFile(url);
                  if (recipe) {
                    updateRecipe(
                      {
                        image: '',
                      },
                      recipe.id
                    );
                  } else {
                    formik.setFieldValue('image', '');
                  }
                }
              },
            }}
          /> */}
          <TextField field={fields.name} />
          <Rating
            field={fields.score}
            muiRatingProps={{ size: 'large' }}
          />
          <Grid
            container
            spacing={2}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Grid
              item
              xs={12}
              sm={formik?.values.url ? 8 : 12}
            >
              <Box>
                {/* TODO: If url is invalid, save continues */}
                <TextField field={fields.url} />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
            >
              {formik?.values?.url && (
                <Box>
                  <LoadingButton
                    variant="contained"
                    disabled={!!formik.errors.url || !formik.values.url}
                    isLoading={externalDataAction.loading}
                    onClick={async () => fetchExternalData(formik.values.url)}
                  >
                    {t('foodhub:pages.edit-recipe.get-recipe-information')}
                  </LoadingButton>
                </Box>
              )}
            </Grid>
          </Grid>
          {externalDataAction.error && (
            <Typography
              color="error"
              gutterBottom
            >
              {externalDataAction.error}
            </Typography>
          )}
          <AutocompleteChipList
            field={fields.cuisine}
            suggestions={cuisineSuggestions}
          />
          <List field={fields.ingredients} />
          <List
            field={fields.instructions}
            muiTextFieldProps={{ multiline: true }}
          />
          <TextField field={fields.comments} />
          <GridLayout
            itemProps={{ xs: 12, md: 4, lg: 4 }}
            items={[
              <TextField field={fields['time.prep']} />,
              <TextField field={fields['time.cooking']} />,
              <TextField field={fields['time.total']} />,
            ]}
          />
          <TextField field={fields.category} />
          <AutocompleteChipList
            field={fields.keywords}
            suggestions={keywordSuggestions}
          />
          <TextField field={fields.yieldsText} />
          <TextField field={fields['nutrients.calories']} />

          <Images
            field={fields.images}
            uploadImage={async (file) => {
              const storageClass = new FirebaseStorageProvider();
              const url = await storageClass.uploadFile(
                file,
                `uploads/recipes/${recipe?.id}/${file.name}`
              );
              return url;
            }}
            // TODO: action array
            deleteImage={async (url) => {
              const storageClass = new FirebaseStorageProvider();
              await storageClass.deleteFile(url);
            }}
            getFavorite={(url) => {
              return formik.values.image === url;
            }}
            setFavorite={(url) => {
              formik.setFieldValue('image', url);
            }}
            cropImage={async (_url: string) => {
              return '';
            }}
          />

          <Errors fields={fields} />

          {getLogLevel() === 'debug' && (
            <Box mt={2}>
              {/* //TODO: Json field and json editor form components */}
              <JsonTextField />
              <JsonEditor
                data={{ recipe, formik: formik?.values }}
                options={{ collapsed: true }}
              />
            </Box>
          )}
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            {!!recipe && (
              <Button
                onClick={() => {
                  deleteRecipeAndImages(recipe.id);
                  router.push('myRecipes');
                }}
                variant="outlined"
                color="error"
              >
                Delete
              </Button>
            )}
            <CancelButton onClick={() => router.push('myRecipes')}>Cancel</CancelButton>
            <SubmitButton>Save</SubmitButton>
          </CardActions>
        </CustomForm>
      )}
    </>
  );
};

export default RecipeEditCard;
