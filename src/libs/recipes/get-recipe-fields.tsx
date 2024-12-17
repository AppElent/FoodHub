import { Recipe } from '@/schemas/recipe';

export const getKeywordSuggestions = (recipes: Recipe[]) => {
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

export const getCuisineSuggestions = (recipes: Recipe[]) => {
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

// const getRecipeFields = () => {
//   return {
//     name: {
//       name: 'name',
//       label: 'Name',
//     },
//     description: {
//       name: 'description',
//       label: 'Description',
//     },
//     cuisine: {
//       name: 'cuisine',
//       label: 'Cuisine',
//       definition: 'tag_list',
//       suggestions: cuisineSuggestions,
//       custom: {
//         header: true,
//         suggestions: cuisineSuggestions,
//       },
//     },
//     ingredients: {
//       name: 'ingredients',
//       label: 'Ingredients',
//       definition: 'list',
//       //initialValue: [recipe?.ingredients || ['']],
//       custom: {
//         header: true,
//       },
//     },
//     instructions: {
//       name: 'instructions',
//       label: 'Instructions',
//       definition: 'list',
//       //initialValue: [recipe?.instructions || ['']],
//       custom: {
//         numbered: true,
//         header: true,
//       },
//     },
//     prepTime: {
//       name: 'time.prep',
//       label: 'Prep Time',
//       type: 'number',
//       custom: {
//         muiTextFieldProps: {
//           slotProps: {
//             input: {
//               startAdornment: <InputAdornment position="start">Min</InputAdornment>,
//             },
//           },
//         },
//       },
//     },
//     cookTime: {
//       name: 'time.cooking',
//       label: 'Cooking Time',
//       type: 'number',
//       custom: {
//         muiTextFieldProps: {
//           slotProps: {
//             input: {
//               startAdornment: <InputAdornment position="start">Min</InputAdornment>,
//             },
//           },
//         },
//       },
//     },
//     totalTime: {
//       name: 'time.total',
//       label: 'Total Time',
//       type: 'number',
//       custom: {
//         muiTextFieldProps: {
//           slotProps: {
//             input: {
//               startAdornment: <InputAdornment position="start">Min</InputAdornment>,
//             },
//           },
//         },
//       },
//     },
//     comments: {
//       name: 'comments',
//       label: 'Comments',
//     },
//     score: {
//       name: 'score',
//       label: 'Score',
//       type: 'number',
//       definition: 'rating',
//     },
//     url: {
//       name: 'url',
//       label: 'URL',
//       type: 'url',
//     },
//     nutrition: {
//       name: 'nutrition',
//       label: 'Nutrition info',
//       type: 'number',
//     },
//     category: {
//       name: 'category',
//       label: 'Category',
//     },
//     yieldsQty: {
//       name: 'yields.quantity',
//       label: 'Quantity',
//       type: 'number',
//     },
//     yieldsUnit: {
//       name: 'yields.unit',
//       label: 'Unit',
//     },
//     yieldsText: {
//       name: 'yieldsText',
//       label: 'Number of Servings',
//       render: ({ field, formik, options, helpers }: FieldDefinitionConfig) => {
//         return (
//           <DefaultTextField
//             field={field}
//             formik={formik}
//             options={options}
//             helpers={helpers}
//           />
//         );
//       },
//     },
//     keywords: {
//       name: 'keywords',
//       label: 'Keywords',
//       definition: 'tag_list', //TODO: make list of keywords
//       //initialValue: [recipe?.keywords || ['']],
//       custom: {
//         header: true,
//         suggestions: keywordsSuggestions,
//       },
//     },
//     calories: {
//       name: 'nutrients.calories',
//       type: 'object',
//       //accessor: 'nutrients.calories',
//       label: 'Calories',
//       //initialValue: [recipe?.nutrients?.calories || ['']],
//     },
//   };
// };

// export default getRecipeFields;
