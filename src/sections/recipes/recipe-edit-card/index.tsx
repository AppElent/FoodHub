import JsonEditor from '@/components/default/json-editor';
import GridLayout from '@/components/default/ui/grid-layout';
import LoadingButton from '@/components/default/ui/loading-button';
import { getLogLevel } from '@/config';
import usePathRouter from '@/hooks/use-path-router';
import useQueryParamAction from '@/hooks/use-query-param-action';
import useAuth from '@/libs/auth/use-auth';
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
import FirebaseStorageProvider from '@/libs/storage-providers/providers/FirebaseStorageProvider';
import { createRecipeSchema, Recipe, recipeYupSchema } from '@/schemas/recipes/recipe';
import { Box, Button, CardActions, Grid, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RecipeEditDialogProps {
  recipe?: Recipe | null;
  //saveRecipe: (recipe: Recipe, id: string) => Promise<Recipe>;
}

interface externalDataActionInterface {
  loading: boolean;
  error: string | null;
}

const RecipeEditCard = ({ recipe }: RecipeEditDialogProps) => {
  //   const formik = useFormikContext<Recipe>();
  const auth = useAuth({ redirectUnauthenticated: true });
  // Translation
  const { t } = useTranslation();
  // Loading external data state
  const [externalDataAction, setExternalDataAction] = useState<externalDataActionInterface>({
    loading: false,
    error: null,
  });

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

  const { data: recipes, actions: recipeActions } = useData<Recipe>('recipes');
  const { set: setRecipe } = recipeActions;

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
      const savedRecipe = await setRecipe(values, values.id);
      const recipeId = savedRecipe.id;

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
      //router.push('recipeDetails', { id: recipeId });
      //onClose();
    },
  });

  // Receive url query param and fetch recipe data
  useQueryParamAction('url', (url) => {
    const fetchDataAndUpdateFormik = async () => {
      try {
        setExternalDataAction({ loading: true, error: null });
        await formik.setFieldValue('url', url);
        const recipeData = await createRecipeSchema().fetchExternalData(url);
        console.log('RECIPEDATA', recipeData);
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
      //await fetchData(`https://api-python.appelent.site/recipes/scrape?url=${url}`);
    };
    if (url && formik.values.url !== url && !externalDataAction.loading) {
      //TODO: check if valid url using formik
      fetchDataAndUpdateFormik();
    }
  });

  // // Fetch recipe data from api
  // const {
  //   data: externalRecipeData,
  //   loading,
  //   error: fetchUrlError,
  //   fetchData,
  // } = useFetch<{ status: string; data: ExternalRecipe }>(
  //   `https://api-python.appelent.site/recipes/scrape?url=${formik?.values.url}`,
  //   {
  //     autoFetch: false,
  //   }
  // );

  // useEffect(() => {
  //   if (externalRecipeData) {
  //     if (externalRecipeData && externalRecipeData.status === 'success') {
  //       formik.setValues({
  //         ...formik.values,
  //         ...parseExternalRecipeData(externalRecipeData.data),
  //       });
  //     }
  //     //formik.handleSubmit();
  //   }
  // }, [externalRecipeData]); //TODO: just a normal fetch function and error in state

  useEffect(() => {
    console.log('FORMIK', formik);
  }, [formik.values]);

  //   // Generate new ID
  //   const id = useGuid();
  //   const recipeId = recipe?.id || id;

  //   const { data: recipes, actions: recipeActions } = useData<Recipe>('recipes');

  //   // Receive url query param and fetch recipe data
  //   useQueryParamAction('url', (url) => {
  //     const fetchDataAndUpdateFormik = async () => {
  //       await formik.setFieldValue('url', url);
  //       await fetchData(`https://api-python.appelent.site/recipes/scrape?url=${url}`);
  //     };
  //     if (url && formik.values.url !== url && !loading) {
  //       //TODO: check if valid url using formik
  //       fetchDataAndUpdateFormik();
  //     }
  //   });

  // Router instance
  const router = usePathRouter();

  //   const { set: setRecipe, delete: deleteRecipe } = recipeActions;

  //   // Delete all images that are uploaded to firebasestorage
  //   const deleteRecipeAndImages = async (recipeId: string) => {
  //     const storageClass = new FirebaseStorageProvider();

  //     // Check images and image url
  //     const images = recipe?.images || [];
  //     if (recipe?.image) {
  //       images.push(recipe.image);
  //     }
  //     for (const url of images) {
  //       // Check if image url is manually uploaded to firebasestorage
  //       if (url?.startsWith('https://firebasestorage.googleapis.com')) {
  //         await storageClass.deleteFile(url);
  //       }
  //     }
  //     await deleteRecipe(recipeId);
  //   };

  //   const initialValues = useMemo(() => {
  //     return {
  //       owner: auth.user?.id,
  //       ...recipe,
  //     };
  //   }, [recipe, auth.user]);

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

  // useEffect(() => {
  //   // Temp to fix yields
  //   if (typeof formik?.values?.yields === 'string') {
  //     formik.setFieldValue('yields', undefined);
  //   }
  // }, [formik?.values?.yields]);

  //   // Conditions for disabling submit button
  //   const disableSubmit =
  //     formik?.isSubmitting || loading || !formik?.isValid || !formik?.dirty || formik?.isValidating;

  return (
    <>
      {' '}
      {fields && (
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
            // muiRatingProps: {
            //   size: 'large',
            // },
          }}
        >
          <Image
            name="image"
            field={fields.image}
          />
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
                    onClick={async () => {
                      const data = await createRecipeSchema().fetchExternalData(formik.values.url);
                      formik.setValues({
                        ...formik.values,
                        ...data,
                      });
                    }}
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
            <JsonEditor
              data={{ recipe, formik: formik?.values }}
              options={{ collapsed: true }}
            /> //TODO: Json field and json editor form components
          )}
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            {!!recipe && (
              <Button
                onClick={() => {
                  //deleteRecipeAndImages(recipe.id);
                  formik.resetForm();
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
