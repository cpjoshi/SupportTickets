import React, {useState, useEffect} from 'react';
import * as microsoftTeams from '@microsoft/teams-js';

function LiveIssuesTab(props) {
    const [serverIssues, setServerIssues] = useState([]);
    const [isNetworkAvailable, setNetworkAvailability] = useState(true);

    useEffect(() => {
        const fetchServerIssues = () => {
          microsoftTeams.initialize();
    
          let authHeader = 'Bearer ' + process.env.REACT_APP_TOKEN;
          console.log(authHeader);
          fetch('/api/issues', {headers: {Authorization: authHeader}})
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
            } else {
              // Handle other errors
              console.error('Error fetching server issues:', error.message);
            }
          });
        };
    
        // Fetch server issues initially
        fetchServerIssues();
    
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

    return (
      <div>
      <h2>Server Issues</h2>
      {isNetworkAvailable ? (
        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {serverIssues.map((issue) => (
              <tr key={issue.id}>
                <td>{issue.id}</td>
                <td>{issue.description}</td>
                <td>{issue.priority}</td>
                <td>{issue.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="error-message">
          This screen needs an Internet connection. Try refreshing after the Internet connection is restored.
        </p>
      )}
    </div>
    );
}

export default LiveIssuesTab;
