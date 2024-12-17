import { ExternalRecipe } from '@/schemas/external-recipe';
import { Recipe } from '@/schemas/recipe';

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

export default parseExternalRecipeData;
