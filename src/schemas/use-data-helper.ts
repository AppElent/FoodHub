import { useData } from '@/libs/data-sources-old';
import { UseDataPropsOptions } from '@/libs/data-sources-old/useData';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface UseDataHelperProps<T> extends UseDataPropsOptions<T> {
  label?: string;
  redirect?: string;
  redirectPath?: string;
}

const useDataHelper = <T extends object>(key: string, options: UseDataHelperProps<T> = {}) => {
  const data = useData<T>(key);
  const { t } = useTranslation();

  const setDataKey = (item: T, key: string, value: any) => {
    const newItem = _.cloneDeep(item);
    _.set(newItem, key, value);
    return newItem;
  };

  const updateItem = async (item: Partial<T>, id?: string) => {
    try {
      await data.actions.update(item, id);
      toast.success(
        t('common:notifications.updatedSuccess', { resource: options.label || 'Item' })
      );
    } catch (e) {
      console.error(e);
      toast.error(t('common:notifications.updatedError', { resource: options.label || 'Item' }));
    }
  };

  const deleteItem = async (id?: string) => {
    try {
      await data.actions.delete(id);
      toast.success(t('common:notifications.deleteSuccess', { resource: options.label || 'Item' }));
    } catch (e) {
      console.error(e);
      toast.error(t('common:notifications.deleteError', { resource: options.label || 'Item' }));
    }
  };

  const addItem = async (item: T) => {
    try {
      await data.actions.add(item);
      toast.success(t('common:notifications.createSuccess', { resource: options.label || 'Item' }));
    } catch (e) {
      console.error(e);
      toast.error(t('common:notifications.createError', { resource: options.label || 'Item' }));
    }
  };

  const setItem = async (item: T, id?: string) => {
    try {
      await data.actions.set(item, id);
      toast.success(t('common:notifications.savedSuccess', { resource: options.label || 'Item' }));
    } catch (e) {
      console.error(e);
      toast.error(t('common:notifications.savedError', { resource: options.label || 'Item' }));
    }
  };

  return {
    setDataKey,
    updateItem,
    deleteItem,
    addItem,
    setItem,
    data: data.data,
    loading: data.loading,
    error: data.error,
    get: data.actions.get,
    getAll: data.actions.getAll,
  };
};

export default useDataHelper;
