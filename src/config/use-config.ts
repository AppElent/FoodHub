import { useTranslation } from 'react-i18next';
import config from '.';

const useConfig = () => {
  const { t } = useTranslation();
  console.log(t);

  return config;
}; //TODO: implement useConfig hook

export default useConfig;
