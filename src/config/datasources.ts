import { DataSourcesObject } from '@/libs/data-sources';
import BaseDataSource from '@/libs/data-sources/data-sources/BaseDataSource';
import FirestoreDataSource from '@/libs/data-sources/data-sources/FirestoreDataSource';
import LocalStorageDataSource from '@/libs/data-sources/data-sources/LocalStorageDataSource';
import { createDummySchema, Dummy } from '@/schemas/dummy/dummy';
import { Issue, issueYupSchema } from '@/schemas/issue/issue';
import { QueryClient } from '@tanstack/react-query';
import { db } from './firebase';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

export const dataSources: DataSourcesObject = {
  settings: {
    source: new LocalStorageDataSource({
      target: 'settings',
      targetMode: 'document',
      subscribe: true,
    }),
  },
  dummy: {
    source: new LocalStorageDataSource<Dummy>({
      target: 'dummy',
      targetMode: 'collection',
      subscribe: true,
    }),
  },
  dummy_ls: {
    source: new LocalStorageDataSource<Dummy>({
      target: 'dummy',
      targetMode: 'collection',
      subscribe: false,
    }),
  },
  dummy_document: {
    source: new LocalStorageDataSource<Dummy>({
      target: 'dummy_document',
      targetMode: 'document',
      subscribe: false,
    }),
  },
  dummy_cache: {
    source: new BaseDataSource<Dummy>({
      target: 'dummy_cache',
      targetMode: 'collection',
      subscribe: false,
      data: createDummySchema().getMockData(3),
    }),
    queryOptions: {
      queryKey: ['dummy_cache'],
    },
  },
  issues: {
    source: new FirestoreDataSource<Issue>(
      {
        target: 'issues',
        targetMode: 'collection',
        subscribe: false,
        YupValidationSchema: issueYupSchema,
        //mockOptions: { schema: iss },
      },
      { db }
    ),
  },
};

// const data = dataSources.dummy_ls_subscribe.data;

// // export const defaultQueryOptions = queryOptions({})
// export const setQueryDefaults = (queryClient: QueryClient) => {
//   console.log('Settings default QueryClient options', queryClient);
//   Object.keys(dataSources).forEach((key) => {
//     const dataSource = dataSources[key as keyof typeof dataSources];
//     // If not subscribing, queryFn should be set
//     if (!dataSource.options.subscribe) {
//       console.log(dataSource, key);
//       if (dataSource.options.targetMode === 'collection') {
//         queryClient.setQueryDefaults([key], { queryFn: dataSource.getAll });
//       } else {
//         queryClient.setQueryDefaults([key], {
//           queryFn: ({ queryKey }) => {
//             return queryKey[1] ? dataSource.get(queryKey[1] as string) : dataSource.get();
//           },
//         });
//       }
//     }
//     // Set mutation defaults
//     // queryClient.setMutationDefaults([key, 'add'], { mutationFn: dataSource.add });
//     // queryClient.setMutationDefaults([key, 'update'], {
//     //   mutationFn: (data: any) => dataSource.update(data, data.id),
//     //   meta: { id: 'testID' },
//     //   onError: (err, variables, context) => {
//     //     console.error('Error updating', err, variables, context);
//     //   },
//     // });
//     // queryClient.setMutationDefaults([key, 'set'], {
//     //   mutationFn: (data: any, id?: string) => dataSource.set(data, id),
//     // });
//     // queryClient.setMutationDefaults([key, 'delete'], { mutationFn: dataSource.delete });
//   });
//   // console.log(queryClient.getQueryDefaults(['dummy_ls']));
//   //queryClient.setQueryDefaults(['posts'], { queryFn: fetchPosts })
//   //queryClient.setMutationDefaults(['addPost'], { mutationFn: addPost })
//   //queryClient.setDefaultOptions({ queries: { staleTime: 1000 * 60 * 5 } })
// };

// setQueryDefaults(queryClient);
