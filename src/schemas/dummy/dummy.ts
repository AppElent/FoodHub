import { faker } from '@faker-js/faker';
import { useMemo } from 'react';
import * as Yup from 'yup';
import { createDefaultSchema } from '..';

export const dummyYupSchema = Yup.object().shape({
  id: Yup.string()
    .required('ID is required')
    .min(3, 'Minimum 3 characters')
    .default(() => faker.string.nanoid()),
  name: Yup.string()
    .required('Name is required')
    .min(3, 'Minimum 3 characters')
    .default(() => faker.word.verb() + ' ' + faker.word.noun()),
  string: Yup.string().optional(),
  number: Yup.number().optional(),
  date: Yup.date().optional(),
  boolean: Yup.boolean().optional(),
  array: Yup.array().of(Yup.string().required()).optional(),
  object: Yup.object()
    .shape({
      stringKey: Yup.string().required('Key is required').min(3, 'Minimum 3 characters'),
      numberKey: Yup.number()
        .required('Key is required')
        .min(0, 'Minimum 0')
        .max(100, 'Maximum 100'),
      booleanKey: Yup.boolean().required('Key is required').default(false),
    })
    .optional(),
  email: Yup.string().email().optional(),
  url: Yup.string().url().optional(),
  uuid: Yup.string().uuid().optional(),
  uppercase: Yup.string().uppercase().optional(),
  lowercase: Yup.string().lowercase().optional(),
  min: Yup.string().min(3).optional(),
  max: Yup.string().max(20).optional(),
  oneOf: Yup.string().oneOf(['one', 'two', 'three']).optional(),
  minNumber: Yup.number().min(0).optional(),
  maxNumber: Yup.number().max(100).optional(),
  oneOfNumber: Yup.number().oneOf([1, 2, 3]).optional(),
  minDate: Yup.date().min(new Date()).optional(),
  maxDate: Yup.date().max(new Date()).optional(),
  oneOfDate: Yup.date().oneOf([new Date()]).optional(),
  minArray: Yup.array().of(Yup.string().required()).min(1).optional(),
  maxArray: Yup.array().of(Yup.string().required()).max(3).optional(),
  createdAt: Yup.date()
    .required()
    .default(() => new Date()),
  updatedAt: Yup.date()
    .required()
    .default(() => new Date()),
});

export type Dummy = Yup.InferType<typeof dummyYupSchema>;

export const createDummySchema = () => {
  const translate = (key: string) => `${key.toLocaleUpperCase()}`;
  const defaultSchema = createDefaultSchema<Dummy>(dummyYupSchema, { translate });
  return {
    ...defaultSchema,
  };
};

export const useDummySchema = () => {
  const dummySchema = useMemo(() => createDummySchema(), []);
  return dummySchema;
};

// export const dummyMockSchema = {
//   name: () => faker.word.verb() + ' ' + faker.word.noun(),
// };
