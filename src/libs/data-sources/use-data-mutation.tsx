import { MutationFunction, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import BaseDataSource from './data-sources/BaseDataSource';
import useDatasource from './use-datasource';

export interface UseDataMutationOptions<TData, TVariables, TContext>
  extends UseMutationOptions<TData, Error, TVariables, TContext> {
  mutationKey: unknown[];
  datasource?: BaseDataSource<TData>;
  subscribe?: boolean;
  resource?: string;
  notifications?: {
    addSuccess?: string;
    addError?: string;
    setSuccess?: string;
    setError?: string;
    updateSuccess?: string;
    updateError?: string;
    deleteSuccess?: string;
    deleteError?: string;
  };
  debug?: boolean;
}

type DefaultContext = Record<string, any>;

type MutationType = 'add' | 'set' | 'update' | 'delete';

type TVariablesType<TData, MutationType> = MutationType extends 'add' | 'set'
  ? TData
  : MutationType extends 'update'
    ? Partial<TData>
    : string;

// Overload signatures
function useDataMutation<TData, TContext = DefaultContext>(
  type: 'add' | 'set',
  options: UseDataMutationOptions<TData, TData, TContext>
): ReturnType<typeof useMutation<TData, Error, TData, TContext>>;
function useDataMutation<TData, TContext = DefaultContext>(
  type: 'update',
  options: UseDataMutationOptions<TData, Partial<TData>, TContext>
): ReturnType<typeof useMutation<TData, Error, Partial<TData>, TContext>>;
function useDataMutation<TData, TContext = DefaultContext>(
  type: 'delete',
  options: UseDataMutationOptions<TData, string, TContext>
): ReturnType<typeof useMutation<TData, Error, string, TContext>>;
function useDataMutation<TData, TContext = DefaultContext>(
  type: MutationType,
  options: UseDataMutationOptions<TData | any, any, TContext>
) {
  const { t } = useTranslation();

  const { datasource } = useDatasource({
    key: options.mutationKey,
    datasource: options.datasource,
  });
  //   const key = useMemo(() => options.mutationKey?.[0], [options.mutationKey]);
  //   const type = useMemo(() => options.mutationKey?.[1] as MutationType, [options.mutationKey]);

  type TVariables = TVariablesType<TData, typeof type>;

  const mutationFn: MutationFunction<TData, TVariables> = useCallback(
    async (variables) => {
      const method = (datasource as BaseDataSource<TData>)[type as keyof BaseDataSource<TData>];
      if (!method) {
        throw new Error('Invalid mutation type ' + type);
      }

      const result = await method(variables);
      return result;
    },
    [datasource, type]
  );

  const onMutate = useCallback(
    (variables: TVariables) => {
      // A mutation is about to happen!
      if (options.debug) {
        console.log('onMutate', { mutationKey: options.mutationKey, variables });
      }
      // Optionally return a context containing data to use when for example rolling back
      return variables as unknown as TContext;
    },
    [options.debug, options.mutationKey]
  );

  const onSuccess = useCallback(
    (data: TData, variables: TVariables, context: TContext) => {
      // onsuccess
      if (options.debug) {
        console.log('onSuccess', { mutationKey: options.mutationKey, data, variables, context });
      }
      const notification = options.notifications?.[`${type}Success`];
      toast.success(
        notification ||
          t(`common:notifications.${type}Success`, { resource: options.resource || 'Item' })
      );
    },
    [t, type, options]
  );

  const onError = useCallback(
    (error: Error, variables: TVariables, context: TContext | undefined) => {
      console.error({ mutationKey: options.mutationKey, error, variables, context });
      const notification = options.notifications?.[`${type}Error`];
      toast.error(
        notification ||
          t(`common:notifications.${type}Error`, {
            resource: options.resource || 'Item',
            statusCode: error.message,
          })
      );
    },
    [options, t, type]
  );

  const onSettled = useCallback(
    (data: TData | undefined, error: Error | null, variables?: TVariables, context?: TContext) => {
      // Error or success... doesn't matter!
      if (options.debug) {
        console.log('onSettled', {
          mutationKey: options.mutationKey,
          data,
          error,
          variables,
          context,
        });
      }
    },
    [options.debug, options.mutationKey]
  );

  return useMutation<TData, Error, TVariables, TContext>({
    ...options,
    onMutate: options.onMutate || onMutate,
    onSuccess: options.onSuccess || onSuccess,
    onError: options.onError || onError,
    onSettled: options.onSettled || onSettled,
    mutationFn: options.mutationFn || mutationFn,
  });
}

export default useDataMutation;
