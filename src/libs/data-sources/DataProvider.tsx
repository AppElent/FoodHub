import React, { createContext, useCallback, useEffect, useState } from 'react';
// import { DataSourceObject } from '.';
import { useQueryClient } from '@tanstack/react-query';

interface DataProviderContextProps {
  data: Record<string, any>;
  subscribeToData: (hashedKey: string, key: unknown[]) => void;
  subscriptions: Record<string, () => void>;
}

// Create a context for the data
// eslint-disable-next-line react-refresh/only-export-components
export const DataContext = createContext<DataProviderContextProps | undefined>(undefined);

const DataProvider: React.FC<any> = ({ dataSources, children }) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [subscriptions, setSubscriptions] = useState<Record<string, () => void>>({});
  const queryClient = useQueryClient();

  const getDataSource = useCallback(
    (key: string) => {
      const dataSource = dataSources[key]?.source;
      if (!dataSource) throw new Error(`Data source with key ${key} not found`);
      return dataSource;
    },
    [dataSources]
  );

  const subscribeToData = useCallback(
    (stringKey: string, key: readonly unknown[]) => {
      if (subscriptions[stringKey]) {
        subscriptions[stringKey]();
      }

      try {
        const dataSource = getDataSource(stringKey);
        const unsubscribe = dataSource.subscribe((newData: any) => {
          setData((prev) => ({ ...prev, [stringKey]: newData }));
          queryClient.setQueryData(key, newData);
        });
        setSubscriptions((prev) => ({ ...prev, [stringKey]: unsubscribe }));
      } catch (err) {
        console.error('Error subscribing to data', err);
      }
    },
    [getDataSource, queryClient, subscriptions]
  );

  useEffect(() => {
    return () => {
      Object.values(subscriptions).forEach((unsubscribe) => unsubscribe());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('Data sources have new data', data);
  }, [data]);

  return (
    <DataContext.Provider
      value={{
        data,
        subscribeToData,
        subscriptions,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
