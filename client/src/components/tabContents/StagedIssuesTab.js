import React, { useState, useEffect } from 'react';
import IssueForm from '../../forms/IssueForm';

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

  const handleCreateNewIssue = () => {
    setFormVisibility(true);
  };

  const handleNewIssue = (action, issue) => {
    // call parent 
  }
  const handleCloseIssueForm = () => {
    setFormVisibility(false);
  }

  useEffect(() => {
    const storedStagedIssues = JSON.parse(localStorage.getItem('stagedIssues')) || [];
    setStagedIssues(storedStagedIssues);
  }, []);

  return (
    <div>
      <h2>Staged Issues</h2>
      <p>Issues that have been created or updated but not yet saved.</p>
      <p>Click on an issue to edit it.</p>
      <p>Click the X to delete an issue.</p>

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

      {isFomVisible && (
          <IssueForm
            onSave={handleNewIssue}
            onClose={handleCloseIssueForm}
            selectedIssue={selectedIssue}
          />
        )}
    </div>
  );
}

export default StagedIssuesTab;
