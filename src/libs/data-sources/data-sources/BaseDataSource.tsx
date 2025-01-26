import { faker } from '@faker-js/faker';
import _ from 'lodash';
import * as yup from 'yup';
import { DataSourceInitOptions, FilterObject } from '..';

interface validateOptions extends yup.ValidateOptions {
  full?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors?: Record<string, string[]>;
  values: any;
}

class BaseDataSource<T, Z = T[]> {
  protected defaultOptions: Partial<DataSourceInitOptions<T, Z>> = {
    targetMode: 'collection' as const,
    subscribe: false,
    converter: {
      toDatabase: (data: T): any => data,
      fromDatabase: (data: any): T => data,
    },
    idField: 'id' as keyof T,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  };
  options: DataSourceInitOptions<T, Z>;
  private converter = {
    toDatabase: (data: T): any => data,
    fromDatabase: (data: any): T => data,
  };
  defaultValue: any = null;
  providerConfig: any;
  provider: string;
  data?: Z | T[] | T;
  subscribers: Array<(data: T | null) => void> = [];

  constructor(options: DataSourceInitOptions<T, Z>, providerConfig?: any) {
    this.provider = 'Base';
    this.providerConfig = providerConfig;
    this.options = {
      ...this.defaultOptions,
      ...options,
    };
    this.converter = this.options.converter || this.converter!;
    if (new.target === BaseDataSource && !this.options?.data) {
      throw new TypeError('When constructing BaseDataSource directly, data is required');
    }
    if (this.options.data) {
      this.data = this.options.data;
    }
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
    this.set = this.set.bind(this);
    this.delete = this.delete.bind(this);
    this.validate = this.validate.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.notifySubscribers = this.notifySubscribers.bind(this);
    this.#validateYupSchema = this.#validateYupSchema.bind(this);
    this.setDefaultValue();
  }

  generateNanoId = () => {
    return faker.string.nanoid();
  };

  setDefaultValue = () => {
    switch (this.options.targetMode) {
      case 'collection':
        this.defaultValue = [];
        break;
      case 'document':
        this.defaultValue = {};
        break;
      case 'string':
        this.defaultValue = '';
        break;
      case 'number':
        this.defaultValue = 0;
        break;
      case 'boolean':
        this.defaultValue = false;
        break;
    }
  };

  // TODO: implement method overloading, T or partial T
  #validateYupSchema = async (
    data: Partial<T>,
    options?: validateOptions
  ): Promise<ValidationResult> => {
    const combinedOptions = { full: false, abortEarly: false, ...options };
    const returnObject: ValidationResult = {
      valid: true,
      errors: undefined,
      values: data,
    };
    if (this.options.YupValidationSchema) {
      try {
        const validationSchema = options?.full
          ? this.options.YupValidationSchema
          : (this.options.YupValidationSchema as yup.ObjectSchema<any>).pick(
              Object.keys(data) as (keyof typeof this.options.YupValidationSchema)[]
            );
        //await this.options.YupValidationSchema.validate(data, { abortEarly: false });
        await validationSchema.validate(data, combinedOptions);
      } catch (error: any) {
        if (error instanceof yup.ValidationError) {
          // Collect multiple errors for each path
          const errorMessages = error.inner.reduce((acc: Record<string, string[]>, err) => {
            if (err.path && !acc[err.path]) {
              acc[err.path] = [];
            }
            if (err.path) {
              acc[err.path].push(err.message);
            }
            return acc;
          }, {});
          console.error('Validation error', errorMessages);
          returnObject.valid = false;
          returnObject.errors = errorMessages;
          console.error('Validation error:', returnObject);
        } else {
          console.error('Unexpected error:', error);
          throw error;
        }
      } finally {
        console.log('VALIDATION', returnObject);
      }
    }
    return returnObject;
  };

  validate = async (data: Partial<T>, options?: validateOptions): Promise<ValidationResult> => {
    //await this.#validateSchema(data, options);
    return await this.#validateYupSchema(data, options);
  };

  // // TODO: finish implementation OR go to converters
  // cleanValues = (data: Partial<T>): Partial<T> => {
  //   const isObject = ['collection', 'document'].includes(this.options.targetMode || '');
  //   const cleanedData: any = isObject ? {} : data;
  //   if (isObject) {
  //     for (const [key, value] of Object.entries(data)) {
  //       if (value !== undefined || !this.options.cleanValues?.removeUndefined) {
  //         cleanedData[key] = value;
  //       }
  //     }
  //   }
  //   return cleanedData;
  // };

  // protected _getDefaultValue = (): any => {
  //   let fallback;

  //   switch (this.options.targetMode) {
  //     case 'collection':
  //       fallback = [];
  //       break;
  //     case 'document':
  //       fallback = {};
  //       break;
  //     case 'string':
  //       fallback = '';
  //       break;
  //     case 'number':
  //       fallback = 0;
  //       break;
  //     case 'boolean':
  //       fallback = false;
  //       break;
  //     default:
  //       fallback = null;
  //       break;
  //   }
  //   return this.options.defaultValue || fallback;
  // };

  _applyPostFilters = (data: T[], filterConfig: FilterObject<T>): Partial<T>[] => {
    let result = data;
    const { limit, orderBy, pagination, filters, select } = filterConfig;

    if (filters) {
      result = result.filter((item) => {
        return Object.entries(filters!).every(([_key, value]) => {
          const itemValue = item[value.field as keyof T];
          const filterValue = typeof value.value === 'function' ? value.value() : value.value;
          return itemValue === filterValue;
        });
      });
    }

    if (orderBy) {
      result = result.sort((a, b) => {
        for (const { field, direction } of orderBy!) {
          if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
          if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    if (pagination) {
      const { page, pageSize } = pagination;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      result = result.slice(start, end);
    }

    if (limit !== undefined) {
      result = result.slice(0, limit);
    }

    if (select) {
      // result = result.map((item) => {
      //   const selectedItem: Partial<T> = {};
      //   this.select!.forEach((key) => {
      //     selectedItem[key] = item[key];
      //   });
      //   return selectedItem;
      // });
    }

    return result;
  }; // TODO: apply source filters vs apply class filters

  protected _parseFilters = (): void => {
    throw new Error("Method '_parseFilters' is not implemented.");
  };

  prepareSave = (data: T): any => {
    // Check if ID exists
    if (!data[this.options.idField as keyof T] && this.options.idField) {
      data[this.options.idField] = this.generateNanoId() as unknown as T[keyof T];
    }
    // Set dates
    if (this.options.timestamps) {
      const now = new Date().toISOString();
      if (
        this.options.timestamps?.createdAt &&
        _.has(data, this.options.timestamps.createdAt) &&
        !data[this.options.timestamps.createdAt]
      ) {
        (data as Record<string, any>)[this.options.timestamps.createdAt] = now;
      }
      if (this.options.timestamps?.updatedAt && _.has(data, this.options.timestamps.updatedAt)) {
        (data as Record<string, any>)[this.options.timestamps.updatedAt] = now;
      }
    }
    // Convert
    data = this.converter.toDatabase(data);

    return data;
  };

  async get(id?: string): Promise<T | null> {
    if (!this.data && this.provider === 'Base') {
      throw new Error('No data found');
    } else if (this.options.targetMode === 'collection' && !id) {
      throw new Error('get() requires an ID when using collections');
    } else if (this.provider === 'Base') {
      if (this.options.targetMode === 'document') {
        return this.converter.fromDatabase(this.data) as T;
      } else {
        const data = (this.data as T[]).find((item: any) => item[this.options.idField] === id);
        return data ? this.converter.fromDatabase(data) : null;
        // return (this.data as T[]).find((item: any) => item[this.options.idField] === id) || null;
      }
    }
    return null;
  }

  async getAll(_filter?: FilterObject<T>): Promise<T[]> {
    if (!this.data && this.provider === 'Base') {
      throw new Error('No data found');
    } else if (this.options.targetMode === 'document') {
      throw new Error('getAll() can only be used with collections');
    } else if (this.provider === 'Base') {
      return (this.data as T[]).map((item: any) => this.converter.fromDatabase(item)) as T[];
    }
    return [];
  }

  async add(item: T): Promise<any> {
    if (!this.data && this.provider === 'Base') {
      throw new Error('No data found');
    } else if (this.options.targetMode !== 'collection') {
      throw new Error('add() can only be used with collections');
    }

    // Validate new data
    const validateResult = await this.validate(item);
    if (!validateResult.valid) {
      throw new Error('Validation failed');
    }

    // Prepare data
    item = this.prepareSave(item);

    // Add data to baseProvider
    if (this.provider === 'Base') {
      const data = this.converter.toDatabase(item);
      if (!data[this.options.idField]) {
        data[this.options.idField] = this.generateNanoId();
      }
      (this.data as T[]).push(data);
      this.notifySubscribers(this.data as Z);
    }

    return item;
  }

  async update(data: Partial<T>, id?: string): Promise<any> {
    if (!this.data && this.provider === 'Base') {
      throw new Error('No data found');
    } else if (this.options.targetMode === 'collection' && !id) {
      throw new Error('id must be provided when using collections');
    }

    // Validate new data
    const validateResult = await this.validate(data);
    if (!validateResult.valid) {
      throw new Error('Validation failed');
    }

    // Prepare data
    data = this.prepareSave(data as T);

    // Update data to baseprovider
    if (this.provider === 'Base') {
      const saveData = this.converter.toDatabase(data as T);
      if (this.options.targetMode === 'document') {
        this.data = {
          ...this.data,
          ...saveData,
        };
      } else {
        if (Array.isArray(this.data)) {
          const itemIndex = this.data.findIndex((item: any) => item[this.options.idField] === id);
          if (itemIndex > -1) {
            this.data[itemIndex] = {
              ...this.data[itemIndex],
              ...saveData,
            };
          }
        }
      }
      this.notifySubscribers(this.data as Z);
    }
  }

  async set(data: T, id?: string): Promise<any> {
    if (!this.data && this.provider === 'Base') {
      throw new Error('No data found');
    } else if (this.options.targetMode === 'collection' && !id) {
      throw new Error('id must be provided when using collections');
    }

    // Validate new data
    const validateResult = await this.validate(data);
    if (!validateResult.valid) {
      throw new Error('Validation failed');
    }

    // Prepare data
    data = this.prepareSave(data);

    // Update data to baseprovider
    if (this.provider === 'Base') {
      const saveData = this.converter.toDatabase(data as T);
      if (this.options.targetMode === 'document') {
        this.data = saveData;
      } else {
        if (Array.isArray(this.data)) {
          const itemIndex = this.data.findIndex((item: any) => item[this.options.idField] === id);
          if (itemIndex > -1) {
            this.data[itemIndex] = saveData;
          }
        }
      }
      this.notifySubscribers(this.data as Z);
    }
  }

  subscribe(callback: (data: T | null) => void): () => void {
    if (!this.data && this.provider === 'Base') {
      throw new Error('No data found');
    }

    this.subscribers.push(callback);

    // Call the callback immediately with the current data
    callback(this.data as T | null);

    // Return an unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  private notifySubscribers = (data: Z) => {
    this.subscribers.forEach((callback) => callback(data as T | null));
  };

  async delete(id?: string): Promise<void> {
    if (!this.data && this.provider === 'Base') {
      throw new Error('No data found');
    } else if (this.options.targetMode === 'collection' && !id) {
      throw new Error('id must be provided when using collections');
    } else if (this.provider === 'Base') {
      if (this.options.targetMode === 'document') {
        this.data = undefined;
      } else {
        if (Array.isArray(this.data)) {
          this.data = (this.data as T[]).filter((item: any) => item[this.options.idField] !== id);
        }
      }
      this.notifySubscribers(this.data as Z);
    }
  }
}

export default BaseDataSource;
