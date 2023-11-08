import React, { useState, useEffect, useContext } from 'react';
import * as microsoftTeams from '@microsoft/teams-js';
import { TeamsContext } from '../../Main';
import { FullPageError } from '../../models/ErrorModel';
import ErrorPage from '../ErrorPage';
import IssueTable from './IssueTable';

function LiveIssuesTab(props) {
  const [apiFetchError, setAPIFetchError] = useState(null); // TODO: use this to show error message
  const [serverIssues, setServerIssues] = useState([]);
  const [isNetworkAvailable, setNetworkAvailability] = useState(true);
  const teamsToken = useContext(TeamsContext).token;

  const fetchServerIssues = (token) => {
    microsoftTeams.initialize();

    let authHeader = 'Bearer ' + token;
    console.log(authHeader);
    fetch('/api/issues', { headers: { Authorization: authHeader } })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 401) {
          throw new Error('UnAuthorized');
        } else {
          throw new Error('Unexpected error');
        }
      })
      .then((data) => setServerIssues(data))
      .catch((error) => {
        if (error.message === 'UnAuthorized') {
          // Handle UnAuthorized error (show error message, redirect, etc.)
          console.log('UnAuthorized: TODO: show this error to the user');
          setAPIFetchError(error.message);
        } else {
          // Handle other errors
          console.error('Error fetching server issues:', error.message);
          setAPIFetchError(error.message);
        }
      });
  };

  useEffect(() => {
    // Fetch server issues initially
    fetchServerIssues(teamsToken);

  }, [teamsToken]);


  useEffect(() => {

    // Add event listener to fetch server issues when online
    const handleOnline = () => {
      fetchServerIssues();
    };

    window.addEventListener('online', handleOnline);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('online', handleOnline);
    };

  }, []);

  const handleRetry = () => {
    console.log('TODO: handle retry');
  };

  const liveIssuesPage = () => {
    return (
      <div> 
        <div className='hint-box'>
          <p >Issues that have been fetched from server.</p>
        </div>
        <br/>       
      <IssueTable issues={serverIssues}/>
      </div>
      );
  };

  if (!isNetworkAvailable) {
    return <ErrorPage fullpageError={FullPageError.NO_INTERNET} actionHandler={handleRetry} />;
  } else if (apiFetchError != null || serverIssues.length === 0) {
    return <ErrorPage fullpageError={FullPageError.NO_DATA} actionHandler={handleRetry} />;
  } else {
    return liveIssuesPage;
  }
}

export default LiveIssuesTab;
