import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import BaseDataSource from './data-sources/BaseDataSource';
import useDatasource from './use-datasource';

export interface UseDataPropsOptions<T> extends UseQueryOptions<T> {
  // key: string | unknown[]
  queryKey: unknown[];
  subscribe?: boolean;
  datasource?: BaseDataSource<any, any>;
  addDatasourceWhenNotAvailable?: boolean;
}

function useDataQuery<TData, TSelectData = TData>(
  options: UseDataPropsOptions<any>
): UseQueryResult<TSelectData> {
  const { datasource, queryOptions } = useDatasource({
    key: options.queryKey,
    datasource: options.datasource,
    subscribe: options.subscribe !== undefined ? options.subscribe : true,
  });
  // const queryClient = useQueryClient();
  // const defaults = queryClient.getQueryDefaults(options.queryKey);
  const queryFn =
    datasource?.options?.subscribe && options.queryKey.length === 1 // subscribe to data is set and querykey is base-key
      ? undefined // undefined means no custom query
      : options.queryFn
        ? options.queryFn // if queryFn is provided, use it
        : datasource?.options?.targetMode === 'collection'
          ? () => datasource?.getAll() as Promise<TData>
          : () => datasource?.get() as Promise<TData | null>;
  const query = useQuery<TData, Error, TSelectData>({
    ...(queryOptions || {}),
    ...options,
    queryFn,
  });

  return query as UseQueryResult<TSelectData, Error>;
}

export default useDataQuery;
