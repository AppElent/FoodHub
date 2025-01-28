import { isEqual } from 'lodash';
import { useRef } from 'react';

function useDeepCompareMemo<T>(value: T | undefined) {
  const ref = useRef<T>(undefined);

  if (!isEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}

export default useDeepCompareMemo;
