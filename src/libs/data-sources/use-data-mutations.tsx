import { UseMutationOptions } from '@tanstack/react-query';
import BaseDataSource from './data-sources/BaseDataSource';
import useDataMutation from './use-data-mutation';

export interface UseDataMutationOptions<TData, TVariables, TContext>
  extends UseMutationOptions<TData, Error, TVariables, TContext> {
  mutationKey: unknown[];
  datasource?: BaseDataSource<TData>;
  subscribe?: boolean;
}

type DefaultContext = Record<string, any>;

const useDataMutations = <TData, TContext = DefaultContext>(options: any) => {
  const updateItem = useDataMutation<TData, TContext>('update', {
    ...options,
    mutationKey: options.mutationKey,
  });
  const setItem = useDataMutation<TData, TContext>('set', {
    ...options,
    mutationKey: [options.mutationKey[0], 'set'],
  });
  const addItem = useDataMutation<TData, TContext>('add', {
    ...options,
    mutationKey: [options.mutationKey[0], 'add'],
  });
  const deleteItem = useDataMutation<TData, TContext>('delete', {
    ...options,
    mutationKey: [options.mutationKey[0], 'delete'],
  });

  return {
    update: updateItem,
    set: setItem,
    add: addItem,
    delete: deleteItem,
  };
};

export default useDataMutations;
