import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useDeepCompareMemo from './use-deep-compare-memo';

interface UseParamItemProps<T> {
  id?: string;
  field?: string;
  items: T[];
  defaultValue?: T;
}

const useParamItem = <T extends Record<string, any>>({
  id = 'id',
  items,
  field = 'id',
  defaultValue,
}: UseParamItemProps<T>) => {
  const params = useParams();
  const stableDefaultValue = useDeepCompareMemo(defaultValue);
  const item = useMemo(() => {
    const idParam = params[id];
    if (!idParam) {
      throw new Error(`useParamItem: ${id} is required`);
    }
    const foundItem = items.find((item: T) => item[field] === idParam);
    if (!foundItem) {
      return stableDefaultValue;
    }
    return foundItem;
  }, [items, params, id, field, stableDefaultValue]);
  return item;
};

export default useParamItem;
