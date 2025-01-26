import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentSnapshot,
  Firestore,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  setDoc,
  SnapshotOptions,
  UpdateData,
  updateDoc,
  where,
} from 'firebase/firestore';
import { DataSourceInitOptions, FilterObject, FilterReturn } from '..';
import BaseDataSource from './BaseDataSource';

interface FirestoreDataSourceProviderConfig {
  db: Firestore;
  clearUndefinedValues?: boolean;
  converter?: {
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => any;
    toFirestore: (data: any) => any;
  };
}

// TODO: getDocFromCache implement

export class FirestoreDataSource<T, Z = T[]> extends BaseDataSource<T, Z> {
  public firestore: Firestore;
  public ref: any;
  private defaultConverter: {
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions) => any;
    toFirestore: (data: any) => any;
  } = {
    fromFirestore: (snapshot: QueryDocumentSnapshot) => ({ ...snapshot.data(), id: snapshot.id }),
    toFirestore: (data: T) => data,
  };
  //public converter = this.defaultConverter;

  constructor(
    options: DataSourceInitOptions<T, Z>,
    providerConfig: FirestoreDataSourceProviderConfig
  ) {
    super(options, providerConfig);

    this.provider = 'Firestore';
    this.firestore = providerConfig.db;
    const converter = providerConfig.converter || this.defaultConverter;
    if (this.options.targetMode === 'collection') {
      this.ref = collection(this.firestore, this.options.target).withConverter(converter);
    } else if (this.options.targetMode === 'document') {
      this.ref = doc(this.firestore, this.options.target).withConverter(converter);
    }
  }

  // Get document reference
  #getRef = (id?: string) => {
    //TODO: implement this
    if (!id && this.options.targetMode === 'collection') {
      throw new Error('get() requires an ID when using collections');
    }
    const docRef = this.options?.targetMode !== 'collection' ? this.ref : doc(this.ref, id);
    return docRef;
  };

  // Parses filter and returns an object for provider specific filterand and the generic js filtering
  #parseFilters = (filterObject: FilterObject<T>): FilterReturn<T> => {
    let q = this.ref;

    // Apply filters
    if (filterObject.filters) {
      filterObject.filters.forEach(({ field, operator, value }) => {
        // Is value is a function, run it, otherwise use the value as is
        const defValue = typeof value === 'function' ? value() : value;
        q = query(q, where(field as string, operator, defValue));
      });
    }

    // Apply ordering
    // if (filterObject.orderBy) {
    //   filterObject.orderBy.forEach(({ field, direction }) => {
    //     q = query(q, orderBy(field as string, direction));
    //   });
    // }

    // Apply limit
    if (filterObject.limit) {
      q = query(q, limit(filterObject.limit));
    }

    return {
      provider: q,
      // return all properties of filterobject that havent been used
      postFilter: {
        ...filterObject,
        filters: undefined,
        //orderBy: undefined,
        limit: undefined,
      },
    };
  };

  // Get a single document by ID
  get = async (id?: string): Promise<T | null> => {
    try {
      await super.get(id);
      // if (!id && this.options.targetMode !== 'document') {
      //   throw new Error('get() requires an ID when using collections');
      // }
      const docRef = this.#getRef(id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return { id: docSnap.id, ...(data ? data : {}) } as T;
      } else {
        return this.defaultValue;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  };

  // Get all documents in the collection, with optional filters
  getAll = async (filter?: FilterObject<T>): Promise<T[]> => {
    try {
      await super.getAll(filter);
      // if (this.options.targetMode !== 'collection')
      //   throw new Error('getAll() can only be used with collections');

      // Parse filter object
      const filterObject = filter || this.options.targetFilter || {};
      //console.log(filterObject, filter, this.options.targetFilter);
      const { provider: query, postFilter } = this.#parseFilters(filterObject);

      const querySnapshot = await getDocs(query);
      let documents: any[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...(doc.data() as object) });
      });
      documents = this._applyPostFilters(documents, postFilter);
      return documents as T[];
    } catch (error) {
      console.error('Error getting documents:', error);
      throw error;
    }
  };

  // Add a new document to the collection
  add = async (item: T): Promise<T> => {
    try {
      await super.add(item);
      // if (this.options.targetMode !== 'collection')
      //   throw new Error('add() can only be used with collections');
      // // Validate new data
      // this.validate(item);
      const docRef = await addDoc(this.ref, item);
      const newDoc = await getDoc(docRef);
      return { id: docRef.id, ...newDoc.data() } as T;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  };

  // Update an existing document by ID
  update = async (data: Partial<T>, id?: string): Promise<void> => {
    try {
      await super.update(data, id);
      // if (!id && this.options.targetMode !== 'document') {
      //   throw new Error('update() requires an ID when using collections');
      // }
      const docRef = this.#getRef(id);
      // const validateResult = await this.validate(data, { strict: false });
      // if (!validateResult.valid) {
      //   throw new Error('Validation failed');
      // }
      await updateDoc(docRef, data as UpdateData<Partial<T>>);
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  };

  // Update an existing document by ID
  set = async (data: T, id?: string): Promise<void> => {
    try {
      await super.set(data, id);
      // Validate updated data
      // if (!id && this.options.targetMode !== 'document') {
      //   throw new Error('set() requires an ID when using collections');
      // }
      // this.validate(data); // TODO: fix validation everywhere
      const docRef = this.#getRef(id);
      await setDoc(docRef, data);
    } catch (error) {
      console.error('Error setting document:', error);
      throw error;
    }
  };

  // Delete a document by ID
  delete = async (id?: string): Promise<void> => {
    try {
      await super.delete(id);
      // if (!id && this.options.targetMode !== 'document') {
      //   throw new Error('get() requires an ID when using collections');
      // }
      const docRef = this.#getRef(id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  };

  // Subscribe to real-time updates for the collection
  subscribe = (callback: (data: any) => any) => {
    const { provider, postFilter } = this.#parseFilters(this.options.targetFilter || {});
    const unsubscribe =
      this.options?.targetMode === 'document'
        ? onSnapshot(provider, (snapshot: DocumentSnapshot) => {
            const data = snapshot.data();
            if (data) {
              callback(data);
            } else {
              callback(null);
            }
          })
        : onSnapshot(provider, (snapshot: QuerySnapshot) => {
            // const documents: T[] = [];
            // snapshot.forEach((doc: QueryDocumentSnapshot) => {
            //   documents.push({ ...doc.data() } as T);
            // });
            const documents: T[] = snapshot.docs.map((doc) => doc.data() as T);
            callback(this._applyPostFilters(documents, postFilter));
          });

    // Return a function to unsubscribe from real-time updates
    return () => unsubscribe();
  };
}

export default FirestoreDataSource;
