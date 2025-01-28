import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TabData } from '.';

export interface TabOptions {
  initialData?: string;
  queryParamName?: string;
}

const useTabs = (tabsData: TabData[], options?: TabOptions) => {
  const { initialData, queryParamName } = options || {};

  const [searchParams, setSearchParams] = useSearchParams();

  // Determine the initial tab value
  const initialTab = useMemo(() => {
    if (queryParamName && searchParams.has(queryParamName)) {
      const paramValue = searchParams.get(queryParamName);
      return tabsData.some((tab) => tab.value === paramValue) ? paramValue : initialData;
    }
    return initialData || tabsData[0]?.value;
  }, [queryParamName, searchParams, tabsData, initialData]);

  const [currentTab, setCurrentTab] = useState(initialTab || '');

  // Sync current tab with query param changes
  useEffect(() => {
    if (queryParamName && searchParams.has(queryParamName)) {
      const paramValue = searchParams.get(queryParamName);
      if (
        paramValue &&
        paramValue !== currentTab &&
        tabsData.some((tab) => tab.value === paramValue)
      ) {
        setCurrentTab(paramValue);
      }
    }
  }, [queryParamName, searchParams, currentTab, tabsData]);

  // Update query param on tab change
  const setTab = useCallback(
    (newTab: string) => {
      setCurrentTab(newTab);
      if (queryParamName) {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set(queryParamName, newTab);
        setSearchParams(newSearchParams);
      }
    },
    [queryParamName, searchParams, setSearchParams]
  );

  const handleTabChange = useCallback(
    (_e: any, newValue: any) => {
      setTab?.(newValue);
    },
    [setTab]
  );

  return { tab: currentTab, handleTabChange, setTab, tabsData };
};

export default useTabs;
