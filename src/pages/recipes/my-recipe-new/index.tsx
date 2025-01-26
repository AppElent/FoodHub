import useFetch from '@/hooks/use-fetch';
import useQueryParamAction from '@/hooks/use-query-param-action';
import useAuth from '@/libs/auth/use-auth';
import { CustomForm } from '@/libs/forms';
import parseExternalRecipeData from '@/libs/recipes/parse-external-recipe-data';
import DefaultPage from '@/pages/default/DefaultPage';
import { ExternalRecipe } from '@/schemas/recipes/external-recipe';
import RecipeEditCard from '@/sections/recipes/recipe-edit-card';
import { useEffect } from 'react';

const MyRecipeNew = () => {
  const auth = useAuth();

  // Receive url query param and fetch recipe data
  useQueryParamAction('url', (url) => {
    const fetchDataAndUpdateFormik = async () => {
      await formik.setFieldValue('url', url);
      await fetchData(`https://api-python.appelent.site/recipes/scrape?url=${url}`);
    };
    if (url && formik.values.url !== url && !loading) {
      //TODO: check if valid url using formik
      fetchDataAndUpdateFormik();
    }
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

  return (
    <DefaultPage>
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
        <RecipeEditCard />
      </CustomForm>
    </DefaultPage>
  );
};

export default MyRecipeNew;
