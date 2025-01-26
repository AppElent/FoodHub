import { faker } from '@faker-js/faker';
import * as Yup from 'yup';

type Overrides = Record<string, () => any>;

type SchemaType =
  | Yup.ObjectSchema<any>
  | Yup.StringSchema
  | Yup.NumberSchema
  | Yup.BooleanSchema
  | Yup.DateSchema
  | Yup.ArraySchema<any, any>
  | Yup.MixedSchema;

interface MockDataGeneratorConfig {
  arrayLength?: number;
  overrides?: Overrides;
  validate?: boolean;
}

const defaultOverrides: Overrides = {
  id: () => faker.string.nanoid(),
};

export function createMockDataGenerator<T>(
  schema: SchemaType,
  config: MockDataGeneratorConfig = {}
) {
  const { arrayLength = 3, overrides: customOverrides = {} } = config || {};
  const overrides = { ...defaultOverrides, ...customOverrides };

  function validate(data: any, schema: SchemaType) {
    try {
      schema.validateSync(data, { abortEarly: false });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  function generateMockData<T>(yupSchema?: SchemaType): T {
    const generateSchema = yupSchema || schema;
    if (generateSchema instanceof Yup.ObjectSchema) {
      const fields = generateSchema.fields;
      const mockData: Partial<Record<keyof T, any>> = {};

      for (const key in fields) {
        const typedKey = key as keyof T;
        const field = fields[key];

        if (overrides[key]) {
          if (typeof overrides[key] === 'function') {
            mockData[typedKey] = overrides[key]();
            continue;
          } else {
            mockData[typedKey] = overrides[key];
            continue;
          }
        }

        // Handle common fields by key
        if (key === 'id') {
          mockData[typedKey] = faker.string.nanoid();
          continue;
        }
        //   if (key === 'createdAt' || key === 'updatedAt') {
        //     mockData[typedKey] = faker.date.past();
        //     continue;
        //   }
        // Generate field-specific data using type guards
        if (field instanceof Yup.StringSchema) {
          mockData[typedKey] = generateString(field);
        } else if (field instanceof Yup.NumberSchema) {
          mockData[typedKey] = generateNumber(field);
        } else if (field instanceof Yup.BooleanSchema) {
          mockData[typedKey] = faker.datatype.boolean();
        } else if (field instanceof Yup.DateSchema) {
          mockData[typedKey] = generateDate(field);
        } else if (field instanceof Yup.ArraySchema) {
          const innerSchema = field.innerType;
          mockData[typedKey] = Array.from({ length: arrayLength }, () =>
            generateMockData(innerSchema as SchemaType)
          );
        } else if (field instanceof Yup.ObjectSchema) {
          mockData[typedKey] = generateMockData(field);
        } else {
          mockData[typedKey] = null;
        }
      }

      if (config.validate) {
        const validated = schema.validateSync(mockData as T, { abortEarly: false });
        return validated;
      }
      return mockData as T;
    }

    return null as any;
  }

  function generateString(field: Yup.StringSchema): string {
    const oneOfTest = field.tests.find((test) => test.OPTIONS?.name === 'oneOf');
    if (oneOfTest) {
      const validValues = oneOfTest.OPTIONS?.params?.values;
      return faker.helpers.arrayElement(validValues as string[]);
    }

    // Create default value
    let value = faker.lorem.words(2);

    // Check default Yup tests
    if (field.tests.some((test) => test.OPTIONS?.name === 'email')) {
      value = faker.internet.email();
    } else if (field.tests.some((test) => test.OPTIONS?.name === 'url')) {
      value = faker.internet.url();
    } else if (field.tests.some((test) => test.OPTIONS?.name === 'uuid')) {
      value = faker.string.uuid();
    }

    // CHeck min-max length
    const minTest = field.tests.find((test) => test.OPTIONS?.name === 'min');
    const maxTest = field.tests.find((test) => test.OPTIONS?.name === 'max');

    if (minTest || maxTest) {
      const min = (minTest?.OPTIONS?.params?.min as number) || 1;
      const max = (maxTest?.OPTIONS?.params?.max as number) || 20;

      value = faker.lorem
        .word()
        .repeat(Math.floor(Math.random() * (max - min + 1) + min))
        .slice(0, max);
    }

    // Check uppercase and lowercase
    // console.log(field.tests);
    // if (field.tests.some((test) => test.OPTIONS?.name === 'string_case')) {
    //   const foundTest = field.tests.find((test) => test.OPTIONS?.name === 'string_case');
    //   if (foundTest?.OPTIONS) {
    //     value = isUpperCase ? value.toUpperCase() : value.toLowerCase();
    //   }
    // } else if (field.tests.some((test) => test.OPTIONS?.name === 'lowercase')) {
    //   value = value.toLowerCase();
    // } TODO: not working

    return value;
  }

  function generateNumber(field: Yup.NumberSchema): number {
    const oneOfTest = field.tests.find((test) => test.OPTIONS?.name === 'oneOf');
    if (oneOfTest) {
      const validValues = oneOfTest.OPTIONS?.params?.values;
      return faker.helpers.arrayElement(validValues as number[]);
    }

    // Min-max test
    const minTest = field.tests.find((test) => test.OPTIONS?.name === 'min');
    const maxTest = field.tests.find((test) => test.OPTIONS?.name === 'max');

    const min = (minTest?.OPTIONS?.params?.min as number) || 0;
    const max = (maxTest?.OPTIONS?.params?.max as number) || 100;

    return faker.number.int({ min, max });
  }

  function generateDate(field: Yup.DateSchema): Date {
    const oneOfTest = field.tests.find((test) => test.OPTIONS?.name === 'oneOf');
    if (oneOfTest) {
      const validValues = oneOfTest.OPTIONS?.params?.values;
      return faker.helpers.arrayElement(
        (validValues as string[]).map((date) => new Date(date)) as Date[]
      );
    }

    const minTest = field.tests.find((test) => test.OPTIONS?.name === 'min');
    const maxTest = field.tests.find((test) => test.OPTIONS?.name === 'max');

    const minDate = minTest ? new Date(minTest.OPTIONS?.params?.min as string) : faker.date.past();
    const maxDate = maxTest
      ? new Date(maxTest.OPTIONS?.params?.max as string)
      : faker.date.future();

    return faker.date.between({ from: minDate, to: maxDate });
  }

  const getMockData = (count: number): T[] => {
    const mockData: T[] = [];
    for (let i = 0; i < count; i++) {
      mockData.push(generateMockData());
    }
    return mockData;
  };

  return {
    generateMockData,
    getMockData,
    validate: (data: T) => validate(data, schema),
  };
}
