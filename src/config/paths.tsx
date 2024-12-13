import config from '.';
import { paths } from './routing';

export interface PathItem {
  id: string;
  label: string;
  translationKey?: string;
  to?: string;
  Icon: React.ReactNode;
  category?: string;
}

const debug = config.settings?.logLevel === 'debug';

// TODO: fix
interface MenuCategory {
  id: string;
  label: string;
  translationKey?: string;
  showInMenu?: boolean | (() => boolean);
}

const menuCategories: MenuCategory[] = [
  // {
  //   id: 'recipes',
  //   label: 'Recipes',
  //   translationKey: 'foodhub:menu.recipes',
  // },
  {
    id: 'settings',
    label: 'Settings',
    translationKey: 'common:menu.settings',
  },
  {
    id: 'test',
    label: 'Test pages',
    showInMenu: debug,
  },
  // {
  //   id: 'satisfactory',
  //   label: 'Satisfactory',
  // },
];

export const getPath = (id: string) => paths.find((path) => path.id === id);

const generateMenu = () => {
  const menu = menuCategories
    .filter(
      (c) =>
        c.showInMenu === undefined ||
        (typeof c.showInMenu === 'boolean' ? c.showInMenu : c.showInMenu())
    )
    .map((category) => {
      const items = paths.filter((path) => path.category === category.id);

      return {
        id: category.id,
        label: category.label,
        translationKey: category.translationKey,
        children: items.map((item) => ({
          id: item.id,
          label: item.label,
          translationKey: item.translationKey,
          Icon: item.Icon,
          to: item.to,
        })),
      };
    });

  return menu;
};

export const menu = generateMenu();

export default paths;
