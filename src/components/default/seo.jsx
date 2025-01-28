import PropTypes from 'prop-types';

let titleSuffix;

export const setPageTitleSuffix = (suffix) => {
  titleSuffix = suffix;
};

export const Seo = (props) => {
  const { title } = props;

  const fullTitle = titleSuffix ? (title ? title + ' | ' + titleSuffix : titleSuffix) : title;

  return <title>{fullTitle}</title>;
};

Seo.propTypes = {
  title: PropTypes.string,
};
