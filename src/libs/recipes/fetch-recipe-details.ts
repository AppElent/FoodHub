// TODO: move fetch function here

import { ExternalRecipe } from '@/schemas/external-recipe';

const fetchExternalRecipe = async (url: string): Promise<ExternalRecipe> => {
  const response = await fetch(url);
  if (!response.ok) {
    const responseJson = await response.json();
    console.log(responseJson);
    throw new Error(responseJson.message);
  }
  const result = await response.json();
  return result;
};

export default fetchExternalRecipe;
