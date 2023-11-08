import React, { useState, useEffect } from 'react';
import IssueForm from '../../forms/IssueForm';
import { FullPageError } from '../../models/ErrorModel';
import ErrorPage from '../ErrorPage';
import IssueTable from './IssueTable';

function StagedIssuesTab(props) {
  const [stagedIssues, setStagedIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isFomVisible, setFormVisibility] = useState(false);


  const handleDeleteStagedIssue = (issue) => {
    alert('TODO: handle delete');
  };

  const handleEditIssue = (issue) => {
    showForm(issue);
  };

  const showForm = (issue) => {
    setSelectedIssue(issue);
    setFormVisibility(true);
  };


  const hideForm = () => {
    setSelectedIssue(null);
    setFormVisibility(false);
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
    hideForm()
  }

  useEffect(() => {
    const storedStagedIssues = JSON.parse(localStorage.getItem('stagedIssues')) || [];
    setStagedIssues(storedStagedIssues);
  }, []);


  const handleRetry = () => {
    console.log('TODO: handle retry');
  };

  const rowUpdateAction = {
    title: "Delete",
    actionHandler: (issue) => {
      handleDeleteStagedIssue(issue.id);
    }
  };

  const stagedIssuesPage = () => {
    return (
      <div>
        <div className='hint-box'>
          <p >Issues that have been created or updated but not yet saved.</p>
          <p>Click on an issue to edit it.</p>
        </div>
        <br />

        <button onClick={showForm}>Create New Issue</button>
        <IssueTable issues={stagedIssues} onRowTap={handleEditIssue} rowUpdateAction={rowUpdateAction} />
       
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
