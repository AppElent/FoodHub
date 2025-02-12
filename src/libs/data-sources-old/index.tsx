/* eslint-disable react-refresh/only-export-components */
import { useContext } from 'react';
import * as Yup from 'yup';
import BaseDataSource, { ValidationResult } from './data-sources/BaseDataSource';
import DataProvider, { DataContext } from './DataProvider';
import useData from './useData';

export type WithOptionalId<T> = Omit<T, 'id'> & { id?: string };

export interface DataSourceInitOptions<T, Z = T[]> {
  target: string;
  targetMode?: 'collection' | 'document' | 'number' | 'string' | 'boolean'; //TODO: implement
  targetFilter?: FilterObject<T>;
  subscribe?: boolean;
  YupValidationSchema?: Yup.AnySchema;
  idField?: keyof T;
  // schema?: Record<string, any>;
  defaultValue?: any;
  timestamps?: {
    createdAt?: string;
    updatedAt?: string;
  };
  converter?: {
    toDatabase: (data: T) => any;
    fromDatabase: (data: any) => T;
  };
  data?: Z;
}

export interface DataSourceObject {
  [key: string]: BaseDataSource<any>;
}

export interface DataSourceActions<T> {
  fetchData: (filter?: FilterObject<T>) => Promise<void>;
  getAll: (filter?: FilterObject<T>) => Promise<T[] | []>;
  get: (id?: string) => Promise<T | null>;
  add: (item: WithOptionalId<T>) => Promise<T>;
  update: (data: Partial<WithOptionalId<T>>, id?: string) => Promise<T>; // TODO: method overloading
  set: (data: WithOptionalId<T>, id?: string) => Promise<T>;
  delete: (id?: string) => Promise<void>;
  validate: (data: Partial<T>) => Promise<ValidationResult>;
}

export interface DataSource<T, Z = T[]> {
  //TODO: fix second generic type
  // Options supplied to class constructor
  options?: DataSourceInitOptions<T, Z>;
  providerConfig?: any;
  // Data state
  data: Z; //T | T[] | Partial<T> | null | string | number | boolean;
  loading: boolean;
  error: any;
  // Provider name
  provider: string;
  // Actions
  actions: DataSourceActions<T>;
  // Raw datasource info
  dataSource: any;
  // Custom props
  custom?: {
    [key: string]: any;
  };
}

export type FilterOperator =
  | '=='
  | '!='
  | '<'
  | '<='
  | '>'
  | '>='
  | 'array-contains'
  | 'in'
  | 'not-in'
  | 'array-contains-any';

export interface FilterObject<T> {
  limit?: number;
  orderBy?: { field: keyof T; direction: 'asc' | 'desc' }[];
  pagination?: { page: number; pageSize: number };
  filters?: { field: keyof T; operator: FilterOperator; value: any }[];
  select?: (keyof T)[];
}

export interface FilterReturn<T> {
  provider: any;
  postFilter: FilterObject<T>;
}

export const useDataSources = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataSources must be used within a DataProvider');
  }
  return {
    dataSources: context.dataSources,
    addDataSource: context.addDataSource,
    setDataSource: context.setDataSource,
  };
};

export { DataProvider, useData };
