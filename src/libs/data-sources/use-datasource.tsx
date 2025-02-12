import { dataSources } from '@/config/datasources';
import { useContext, useEffect, useMemo } from 'react';
import BaseDataSource from './data-sources/BaseDataSource';
import { DataContext } from './DataProvider';

interface UseDataSourcesProps {
  key: unknown[];
  datasource?: BaseDataSource<any>;
  subscribe?: boolean;
}

const useDataSource = (options: UseDataSourcesProps) => {
  const memoOptions = useMemo(() => options, []);
  const stringKey = options.key[0] as string;
  const queryKey = options.key as unknown[];
  const datasourceSetting = useMemo(
    () => dataSources[stringKey as keyof typeof dataSources],
    [stringKey]
  );

  if (!datasourceSetting) {
    throw new Error('No datasource setting found for key: ' + stringKey);
  }

  const datasource = useMemo(() => {
    if (memoOptions.datasource) {
      return memoOptions.datasource;
    }
    return datasourceSetting?.source;
  }, [memoOptions.datasource, datasourceSetting]);

  const queryOptions = useMemo(() => {
    return datasourceSetting?.queryOptions || undefined;
  }, [datasourceSetting]);

  if (!datasource) {
    throw new Error('No datasource found for key: ' + stringKey);
  }

  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataSource must be used within a DataProvider');
  }

  const { subscribeToData, subscriptions } = context;

  useEffect(() => {
    if (
      datasource &&
      datasource.options?.subscribe &&
      typeof datasource?.subscribe === 'function' &&
      !subscriptions[stringKey] &&
      options.subscribe
    ) {
      console.log('Subscribing to data with key', stringKey);
      subscribeToData(stringKey, queryKey);
    }
  }, [
    subscribeToData,
    subscriptions,
    // context.dataSources,
    queryKey,
    datasource,
    stringKey,
    options.subscribe,
  ]);

  return { datasource, queryOptions };
};

export default useDataSource;
