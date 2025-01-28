import * as Yup from 'yup';
import { createDefaultSchema } from '..';
import { ExternalRecipe } from './external-recipe';

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
  ingredients: Yup.array().of(Yup.string()).optional().default(['']).label('Ingredients'),
  instructions: Yup.array().of(Yup.string()).optional().default(['']).label('Instructions'),
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

export const createRecipeSchema = () => {
  const defaultSchema = createDefaultSchema<Recipe>(recipeYupSchema);

  const getKeywordsSuggestions = (recipes: Recipe[]) => {
    // Get all unique values from recipe keywords
    return recipes.reduce((acc: any, recipe: Recipe) => {
      recipe.keywords?.forEach((keyword) => {
        if (!acc.includes(keyword)) {
          acc.push(keyword);
        }
      });
      return acc;
    }, []);
  };

  const getCuisineSuggestions = (recipes: Recipe[]) => {
    // Get unique values from categories
    return recipes.reduce((acc: any, recipe: Recipe) => {
      recipe.cuisine?.forEach((cuisine) => {
        if (!acc.includes(cuisine)) {
          acc.push(cuisine);
        }
      });
      return acc;
    }, []);
  };

  const parseExternalRecipeData = (data: ExternalRecipe): Partial<Recipe> => {
    const timeObject =
      data.prep_time || data.cook_time || data.total_time
        ? {
            prep: data.prep_time,
            cooking: data.cook_time,
            total: data.total_time,
          }
        : undefined;
    // TODO: doesnt work yet, example Paste boursin
    // Total time is prep time + cooking time. If one of the fields is empty, calculate the other field if possible
    if (timeObject) {
      if (!timeObject?.total) {
        timeObject.total = (timeObject.prep || 0) + (timeObject.cooking || 0);
      } else if (!timeObject.prep) {
        // Make sure that prep time is not negative
        timeObject.prep = Math.max(0, (timeObject.total || 0) - (timeObject.cooking || 0));
      } else if (!timeObject.cooking) {
        // Make sure that cooking time is not negative
        timeObject.cooking = Math.max(0, (timeObject.total || 0) - (timeObject.prep || 0));
      }
    }

    return {
      ...(data.title && data.title.trim() && { name: data.title }),
      ...(data.description &&
        data.description.trim() && {
          description: data.description,
        }),
      //TODO: cooking times
      // If timeobject is undefined, at to object
      ...(timeObject && { time: timeObject }),
      //...(data.total_time && data.total_time.trim() && { time.total: data.total_time }),
      ...(data.yields &&
        data.yields.trim() && {
          yieldsText: data.yields,
        }), //TODO: make object instead of string
      // ...(data.nutrients && {
      //   nutrients: data.nutrients,
      // }), //TODO: add nutrients
      ...(data.image && data.image.trim() && { image: data.image }),
      ...(data.ingredients &&
        data.ingredients.length > 0 && {
          ingredients: data.ingredients,
        }),
      ...(data.instructions_list &&
        data.instructions_list.length > 0 && {
          instructions: data.instructions_list,
        }),
      ...(data.category &&
        data.category.trim() && {
          category: data.category,
        }),
      ...(data.keywords &&
        data.keywords.length > 0 && {
          keywords: data.keywords,
        }),
      ...(data.cuisine &&
        data.cuisine.trim() && {
          cuisine: data.cuisine.split(','),
        }),

      // external data
      ...(data.site_name && data.site_name.trim() && { site: data.site_name }),
      raw: data,
    };
  };

  const fetchExternalData = async (url: string): Promise<Partial<Recipe>> => {
    // Check if valid url
    function isValidHttpUrl(string: string) {
      let url;

      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }

      return url.protocol === 'http:' || url.protocol === 'https:';
    }
    if (!isValidHttpUrl(url)) {
      throw new Error('Invalid URL');
    }

    const response = await fetch(`https://api-python.appelent.site/recipes/scrape?url=${url}`);
    if (!response.ok) {
      const responseJson = await response.json();
      console.log(responseJson);
      throw new Error(responseJson.message);
    }
    const result: { data: ExternalRecipe } = await response.json();
    // Parse recipe
    const data = parseExternalRecipeData(result.data);
    console.log(result, data);

    return data;
  };

  return {
    ...defaultSchema,
    getTemplate: () => {
      return {
        ...defaultSchema.getTemplate(),
        id: defaultSchema.generateNanoId(),
      };
    },
    getKeywordsSuggestions,
    getCuisineSuggestions,
    fetchExternalData,
    //TODO: delete cleanup images etc
  };
};

//export type RecipeTemplate = Omit<Recipe, 'id'>;

// console.log(extractSchemaLabels(recipeYupSchema));

//export const recipeDefaultValues: Partial<Recipe> = recipeYupSchema.getDefault();

//export const recipeFields = extractFieldDefinitionFromYupSchema(recipeYupSchema, RECIPE_FIELDS);

// console.log(recipeYupSchema.describe());
// console.log(recipeYupSchema.fields);
// console.log(extractFieldDefinitionFromYupSchema(recipeYupSchema, RECIPE_FIELDS));
