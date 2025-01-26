import { createContext } from 'react';
import { TabData } from '.';

// Context to share current tab information
interface CurrentTabContextProps {
  tabs: TabData[];
  currentTab: string;
  handleTabChange: (event: React.ChangeEvent<any>, newValue: string) => void;
  setTab: (tab: string) => void;
}
export const CurrentTabContext = createContext<CurrentTabContextProps | undefined>(undefined);
