import * as Yup from 'yup';

export const recipeTimeYupSchema = Yup.object().shape({
  prep: Yup.number().optional().default(0).label('Preparation Time'),
  cooking: Yup.number().optional().default(0).label('Cooking Time'),
  total: Yup.number().optional().default(0).label('Total Time'),
});

export type RecipeTime = Yup.InferType<typeof recipeTimeYupSchema>;
