import React, { useState, useEffect } from 'react';
import IssueForm from '../../forms/IssueForm';
import { FullPageError } from '../../models/ErrorModel';
import ErrorPage from '../ErrorPage';

function StagedIssuesTab(props) {
  const [stagedIssues, setStagedIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isFomVisible, setFormVisibility] = useState(false);


  const handleDeleteStagedIssue = (issueId) => {
    // call parent 
  };

  const handleEditIssue = (issue) => {
    // call parent 
  };

  const showForm = () => {
    setFormVisibility(true);
  };

  const handleCreateNewIssue = (newIssue) => {
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

    setFormVisibility(false);
    // setActiveTab('Staged');
  };

  const handleCloseIssueForm = () => {
    setFormVisibility(false);
  }

  useEffect(() => {
    const storedStagedIssues = JSON.parse(localStorage.getItem('stagedIssues')) || [];
    setStagedIssues(storedStagedIssues);
  }, []);


  const handleRetry = () => {
    console.log('TODO: handle retry');
  };

  const stagedIssuesPage = () => {
    return (
      <div>
        <h2>Staged Issues</h2>
        <div className='hint-box'>
          <p >Issues that have been created or updated but not yet saved.</p>
          <p>Click on an issue to edit it.</p>
          <p>Click the <em>x</em> to delete an issue.</p>
        </div>

        <br />

        <button onClick={showForm}>Create New Issue</button>

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

        {isFomVisible && (
          <IssueForm
            onSave={handleCreateNewIssue}
            onClose={handleCloseIssueForm}
            selectedIssue={selectedIssue}
          />
        )}
      </div>
    );
  };

  if (stagedIssues === null || stagedIssues.length === 0) {
    return <ErrorPage fullpageError={FullPageError.NO_DATA} actionHandler={handleRetry} />;
  } else {
    return stagedIssuesPage();
  }

}

export default StagedIssuesTab;
