// @ts-nocheck

import JsonEditor from '@/components/default/json-editor';
import GridLayout from '@/components/default/ui/grid-layout';
import { getLogLevel } from '@/config';
import useFetch from '@/hooks/use-fetch';
import useGuid from '@/hooks/use-guid';
import useIsMobile from '@/hooks/use-is-mobile';
import useQueryParamAction from '@/hooks/use-query-param-action';
import useRouter from '@/hooks/use-router';
import { useAuth } from '@/libs/auth';
import { useData } from '@/libs/data-sources';
import { CustomForm } from '@/libs/forms';
import AutocompleteChipList from '@/libs/forms/components/AutocompleteChipList';
import CancelButton from '@/libs/forms/components/CancelButton';
import Errors from '@/libs/forms/components/Errors';
import Image from '@/libs/forms/components/Image';
import Images from '@/libs/forms/components/Images';
import List from '@/libs/forms/components/List';
import Rating from '@/libs/forms/components/Rating';
import SubmitButton from '@/libs/forms/components/SubmitButton';
import TextField from '@/libs/forms/components/TextField';
import useCustomFormik from '@/libs/forms/use-custom-formik';
import { getCuisineSuggestions, getKeywordSuggestions } from '@/libs/recipes/get-recipe-fields';
import parseExternalRecipeData from '@/libs/recipes/parse-external-recipe-data';
import FirebaseStorageProvider from '@/libs/storage-providers/providers/FirebaseStorageProvider';
import { ExternalRecipe } from '@/schemas/external-recipe';
import { recipeFields, recipeYupSchema } from '@/schemas/recipe';
import Recipe from '@/types/recipe';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingButton from '../../components/default/ui/loading-button';

interface RecipeEditDialogProps {
  recipe?: Recipe | null;
  open: boolean;
  onClose: () => void;
}

const RecipeEditDialog = ({ recipe, open, onClose }: RecipeEditDialogProps) => {
  const auth = useAuth();
  // Theme and media query
  // const theme = useTheme();
  const fullScreen = useIsMobile();
  // Translation
  const { t } = useTranslation();

  // Generate new ID
  const id = useGuid();
  const recipeId = recipe?.id || id;

  const { data: recipes, actions: recipeActions } = useData<Recipe>('recipes');

  // Receive url query param and fetch recipe data
  useQueryParamAction('url', (url) => {
    const fetchDataAndUpdateFormik = async () => {
      await formik.setFieldValue('url', url);
      await fetchData(`https://api-python.appelent.site/recipes/scrape?url=${url}`);
    };
    if (url && formik.values.url !== url && !loading) {
      fetchDataAndUpdateFormik();
    }
  });

  // Router instance
  const router = useRouter();

  const { set: setRecipe, delete: deleteRecipe } = recipeActions;

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
      if (url.startsWith('https://firebasestorage.googleapis.com')) {
        await storageClass.deleteFile(url);
      }
    }
    await deleteRecipe(recipeId);
    onClose();
  };

  const initialValues = useMemo(() => {
    return {
      owner: auth.user ? (auth.user as { id: string }).id : '',
      ...recipe,
    };
  }, [recipe, auth.user]);

  // Get fields and suggestions
  const fields = recipeFields;
  const keywordSuggestions = useMemo(() => recipes && getKeywordSuggestions(recipes), [recipes]);
  const cuisineSuggestions = useMemo(() => recipes && getCuisineSuggestions(recipes), [recipes]);

  // Get formik instance ref
  const formik = useCustomFormik({
    initialValues,
    validationSchema: recipeYupSchema,
    enableReinitialize: true,
    onSubmit: async (values: Recipe) => {
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

      // Save
      await setRecipe(values, recipeId);
      // Redirect to recipe page
      if (!recipe) {
        router.push(`/app/recipes/${recipeId}`);
      }
      //onClose();
    },
  });

  useEffect(() => {
    console.log('FORMIK', formik);
  }, [formik.values]);

  // Fetch recipe data from api
  const {
    data: externalRecipeData,
    loading,
    error: fetchUrlError,
    fetchData,
  } = useFetch<{ status: string; data: ExternalRecipe }>(
    `https://api-python.appelent.site/recipes/scrape?url=${formik?.values.url}`,
    {
      autoFetch: false,
    }
  );

  useEffect(() => {
    if (externalRecipeData) {
      if (externalRecipeData && externalRecipeData.status === 'success') {
        formik.setValues({
          ...formik.values,
          ...parseExternalRecipeData(externalRecipeData.data),
        });
      }
      //formik.handleSubmit();
    }
  }, [externalRecipeData]); //TODO: just a normal fetch function and error in state

  useEffect(() => {
    // Temp to fix yields
    if (typeof formik?.values?.yields === 'string') {
      formik.setFieldValue('yields', undefined);
    }
  }, [formik?.values?.yields]);

  // Conditions for disabling submit button
  const disableSubmit =
    formik?.isSubmitting || loading || !formik?.isValid || !formik?.dirty || formik?.isValidating;

  return (
    <>
      {' '}
      {fields && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="md"
          fullWidth
          fullScreen={fullScreen}
        >
          <CustomForm
            formik={formik}
            options={{
              editMode: true,
              debounce: 300,
              muiTextFieldProps: {
                fullWidth: true,
                variant: 'outlined',
                multiline: true,
              },
              muiRatingProps: {
                size: 'large',
              },
            }}
          >
            <DialogTitle
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                {recipe
                  ? t('common:actions.editItem', { resource: t('foodhub:defaults.recipe') })
                  : t('common:actions.addItem', { resource: t('foodhub:defaults.recipe') })}
                <IconButton
                  onClick={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                  }}
                  disabled={disableSubmit}
                  style={{ marginLeft: '8px' }}
                >
                  {<SaveIcon />}
                </IconButton>
              </div>

              <IconButton
                onClick={onClose} // Add your close handler here
                style={{ marginLeft: 'auto' }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Image
                name="image"
                field={fields.image}
              />
              {/* {formik?.values?.image && (
                <Box
                  display="flex"
                  justifyContent="center"
                  mt={2}
                >
                  <img
                    src={formik.values.image}
                    alt="Recipe"
                    width="100%"
                    style={{ borderRadius: '8px', maxHeight: '300px', objectFit: 'contain' }}
                  />
                </Box>
              )} */}
              <TextField field={fields.name} />
              <Rating field={fields.score} />
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
                        isLoading={loading}
                        onClick={() => {
                          fetchData();
                        }}
                      >
                        {t('foodhub:pages.edit-recipe.get-recipe-information')}
                      </LoadingButton>
                    </Box>
                  )}
                </Grid>
              </Grid>
              {fetchUrlError && (
                <Typography
                  color="error"
                  gutterBottom
                >
                  {fetchUrlError}
                </Typography>
              )}

              <AutocompleteChipList
                field={fields.cuisine}
                suggestions={cuisineSuggestions}
              />
              <List field={fields.ingredients} />
              <List field={fields.instructions} />

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
                    `uploads/recipes/${recipeId}/${file.name}`
                  );
                  return url;
                }}
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
                <JsonEditor
                  data={{ recipe, formik: formik?.values }}
                  options={{ collapsed: true }}
                />
              )}
            </DialogContent>
            <DialogActions>
              {!!recipe && (
                <Button
                  onClick={() => {
                    deleteRecipeAndImages(recipe.id);
                    formik.resetForm();
                    onClose();
                  }}
                  variant="outlined"
                  color="error"
                >
                  Delete
                </Button>
              )}
              <CancelButton onClick={onClose}>Cancel</CancelButton>
              {/* <Button
                onClick={() => {
                  formik.resetForm();
                  onClose();
                }}
                color="secondary"
              >
                Cancel
              </Button> */}
              <SubmitButton>Save</SubmitButton>
              <SubmitButton onClick={onClose}>Save and close</SubmitButton>
              {/* <Button
                type="submit"
                color="primary"
              >
                Save
              </Button> */}
            </DialogActions>
          </CustomForm>
        </Dialog>
      )}
    </>
  );
};

export default RecipeEditDialog;
