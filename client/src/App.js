// App.js
import * as microsoftTeams from '@microsoft/teams-js';
import React, { useState, useEffect, useContext } from 'react';
import IssueForm from './forms/IssueForm';
import './App.css';
import { TeamsContext } from './Main';

const App = () => {
  const [activeTab, setActiveTab] = useState('Staged');
  const [stagedIssues, setStagedIssues] = useState([]);
  const [serverIssues, setServerIssues] = useState([]);
  const [isNewIssueFormVisible, setNewIssueFormVisibility] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isNetworkAvailable, setNetworkAvailability] = useState(true);
  const teamsContext = useContext(TeamsContext);

  useEffect(() => {
    const checkNetwork = () => {
      setNetworkAvailability(navigator.onLine);
    };

    checkNetwork();

    window.addEventListener('online', checkNetwork);
    window.addEventListener('offline', checkNetwork);

    return () => {
      window.removeEventListener('online', checkNetwork);
      window.removeEventListener('offline', checkNetwork);
    };
  }, []);


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


  useEffect(() => {
    const storedStagedIssues = JSON.parse(localStorage.getItem('stagedIssues')) || [];
    setStagedIssues(storedStagedIssues);
  }, []);

  const handleNewIssue = (newIssue) => {
    if (selectedIssue) {
      const updatedStagedIssues = stagedIssues.map((issue) =>
        issue.id === selectedIssue.id ? { ...issue, ...newIssue } : issue
      );

      setStagedIssues(updatedStagedIssues);
      localStorage.setItem('stagedIssues', JSON.stringify(updatedStagedIssues));
    } else {
      const updatedStagedIssues = [...stagedIssues, newIssue];
      setStagedIssues(updatedStagedIssues);
      localStorage.setItem('stagedIssues', JSON.stringify(updatedStagedIssues));
    }

    setNewIssueFormVisibility(false);
    setActiveTab('Staged');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleCreateNewIssue = () => {
    setNewIssueFormVisibility(true);
    setSelectedIssue(null);
  };

  const handleCloseIssueForm = () => {
    setNewIssueFormVisibility(false);
    setSelectedIssue(null);
  };

  const handleDeleteStagedIssue = (issueId) => {
    const updatedStagedIssues = stagedIssues.filter((issue) => issue.id !== issueId);
    setStagedIssues(updatedStagedIssues);
    localStorage.setItem('stagedIssues', JSON.stringify(updatedStagedIssues));
  };

  const handleEditIssue = (issue) => {
    setSelectedIssue(issue);
    setNewIssueFormVisibility(true);
  };

  return (
    <div className="app-container">
      <h2>Context</h2>
      <p>{JSON.stringify(teamsContext.context)}</p>
      <hr></hr>
      <h2>TOKEN</h2>
      <p>{JSON.stringify(teamsContext.token)}</p>
      <div className="tabs">
        <button
          className={activeTab === 'Staged' ? 'active-tab' : ''}
          onClick={() => handleTabChange('Staged')}
        >
          Staged
        </button>
        <button
          className={activeTab === 'Issues' ? 'active-tab' : ''}
          onClick={() => handleTabChange('Issues')}
        >
          Issues
        </button>
      </div>
      <div className="content">
        {activeTab === 'Staged' && (
          <div>
            <h2>Staged Issues</h2>
            <button onClick={handleCreateNewIssue}>Create New Issue</button>
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stagedIssues.map((issue) => (
                  <tr key={issue.id} onClick={() => handleEditIssue(issue)}>
                    <td>{issue.description}</td>
                    <td>{issue.priority}</td>
                    <td>{issue.status}</td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStagedIssue(issue.id);
                        }}
                      >
                        &#10006;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'Issues' && (
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
        )}
        {isNewIssueFormVisible && (
          <IssueForm
            onSave={handleNewIssue}
            onClose={handleCloseIssueForm}
            selectedIssue={selectedIssue}
          />
        )}
      </div>
    </div>
  );
};

export default App;
