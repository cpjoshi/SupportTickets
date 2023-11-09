import IconNoData from '../assets/icon-error.svg';
import IconNoResults from '../assets/icon-no-result.svg';
import IconNoInternet from '../assets/icon-no-internet.svg';

// Define the FullPageErrorenum
export const FullPageError = {
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NO_DATA: 'NO_DATA',
  NO_RESULTS: 'NO_RESULTS',
  NO_INTERNET: 'NO_INTERNET'
};

// Export a method that returns an info object based on the given FullPageError enum
export const getFullPageErrorInfo = (fullPageError) => {
  let title, description, icon, actionTitle;

  switch (fullPageError) {
    case FullPageError.NO_DATA:
      title = 'No Data Available';
      description = 'There is no data available to display.';
      icon = IconNoData;
      actionTitle = 'Refresh';
      break;
    case FullPageError.NO_RESULTS:
      title = 'No Results Found';
      description = 'Your search did not match any results.';
      icon = IconNoResults;
      actionTitle = 'Retry';
      break;
    case FullPageError.NO_INTERNET:
      title = 'No Internet Connection';
      description = 'This screen needs an Internet connection. Try refreshing after the Internet connection is restored.'
      icon = IconNoInternet;
      actionTitle = 'Retry';
      break;
    default:
      title = 'Something Went Wrong';
      description = 'An unexpected error occurred.';
      icon = IconNoData;
      actionTitle = '';
  }

  return {
    title,
    description,
    icon,
    actionTitle
  };
};