import { RECIPE_FIELDS } from '@/data/recipe-data';
import * as Yup from 'yup';
import { extractFieldDefinitionFromYupSchema, Schema } from '.';
export const recipeSchema: Schema = {};

// TODO: Fix optional fields with default value... and then undefined values in firestore data
export const recipeYupSchema = Yup.object().shape({
  id: Yup.string().optional().default('').label('ID'),
  owner: Yup.string().required('Owner is required').label('Owner'),
  name: Yup.string()
    .required()
    .min(3)
    .default('')
    .label('Name')
    .meta({ default: '', translationKey: 'foodhub:schemas.recipe.name' }),
  description: Yup.string()
    .optional()
    .default('')
    .label('Description')
    .meta({ default: '', translationKey: 'foodhub:schemas.recipe.description' }),
  time: Yup.object()
    .shape({
      prep: Yup.number().optional().default(0).label('Preparation Time'),
      cooking: Yup.number().optional().default(0).label('Cooking Time'),
      total: Yup.number().optional().default(0).label('Total Time'),
    })
    .optional()
    .label('Time'),
  yields: Yup.object()
    .shape({
      quantity: Yup.number().optional().default(0).label('Quantity'),
      unit: Yup.string().optional().default('servings').label('Unit'),
    })
    .label('Yields'),
  yieldsText: Yup.string().optional().default('').label('Yields'),
  nutrients: Yup.object()
    .shape({
      calories: Yup.string().optional().default('0').label('Calories'),
      fat: Yup.string().optional().default('0').label('Fat'),
      sugar: Yup.string().optional().default('0').label('Sugar'),
      fiber: Yup.string().optional().default('0').label('Fiber'),
      protein: Yup.string().optional().default('0').label('Protein'),
      carbs: Yup.string().optional().default('0').label('Carbohydrates'),
    })
    .optional()
    .label('Nutrients'),
  image: Yup.string().optional().default('').label('Image'),
  images: Yup.array().of(Yup.string()).optional().default([]).label('Images'),
  ingredients: Yup.array()
    .of(Yup.string().min(2, 'Min 2 characters'))
    .optional()
    .default([''])
    .label('Ingredients'),
  instructions: Yup.array()
    .of(Yup.string().min(3, 'Min 3 characters'))
    .optional()
    .default([''])
    .label('Instructions'),
  comments: Yup.string().optional().default('').label('Comments'),
  score: Yup.number().optional().default(0).label('Score').nullable(),
  url: Yup.string().url().optional().default('').label('URL'),
  category: Yup.string().optional().default('').label('Category'),
  keywords: Yup.array()
    .of(Yup.string().min(2, 'Min 2 characters'))
    .optional()
    .default([])
    .label('Keywords'),
  cuisine: Yup.array()
    .of(Yup.string().min(2, 'Min 2 characters'))
    .optional()
    .default([])
    .label('Cuisine'),
  createdAt: Yup.string()
    .optional()
    .default(() => new Date().toISOString())
    .label('Created At'),
  updatedAt: Yup.string()
    .optional()
    .default(() => new Date().toISOString())
    .label('Updated At'),
  site: Yup.string().optional().nullable().default('').label('Site'),
  raw: Yup.mixed().optional().nullable().default({}).label('Raw'),
});

export type Recipe = Yup.InferType<typeof recipeYupSchema>;

export type RecipeTemplate = Omit<Recipe, 'id'>;

// console.log(extractSchemaLabels(recipeYupSchema));

export const recipeDefaultValues: Partial<Recipe> = recipeYupSchema.getDefault();

export const recipeFields = extractFieldDefinitionFromYupSchema(recipeYupSchema, RECIPE_FIELDS);

// console.log(recipeYupSchema.describe());
// console.log(recipeYupSchema.fields);
// console.log(extractFieldDefinitionFromYupSchema(recipeYupSchema, RECIPE_FIELDS));
