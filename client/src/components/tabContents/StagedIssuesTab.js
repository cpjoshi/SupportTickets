import React, { useState, useEffect } from 'react';
import IssueForm from '../../forms/IssueForm';
import { FullPageError } from '../../models/ErrorModel';
import ErrorPage from '../ErrorPage';
import IssueTable from './IssueTable';
import IncidentRepository from '../../db/IncidentRepository';

function StagedIssuesTab(props) {
  const [stagedIssues, setStagedIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isFomVisible, setFormVisibility] = useState(false);
  const [shouldRerender, setShouldRerender] = useState(false);
  const incidentRepo = new IncidentRepository();

  const showForm = (issue) => {
    setSelectedIssue(issue);
    setFormVisibility(true);
  };

  const hideForm = (shouldRefresh) => {
    setSelectedIssue(null);
    setFormVisibility(false);
    
    if (shouldRefresh) {
      setShouldRerender(!shouldRerender);
    }
  };

  const handleCreateNewIssue = (newIssue) => {
    if (selectedIssue) {
      incidentRepo.updateRecordById(selectedIssue.id, newIssue);
    } else if (newIssue) {
      incidentRepo.saveRecord(newIssue);
    }
    hideForm(true);
  }

  useEffect(() => {
    incidentRepo.getRecords().then((issues) => {
      setStagedIssues(issues);
    })
  }, [shouldRerender]);


  //// UI Elements
  const header = <div>
    <div className='hint-box'>
      <p >Issues that have been created or updated but not yet saved.</p>
      <p>Click on an issue to edit it.</p>
    </div>
    <br />
    <button onClick={e => showForm(null)}> Create New Issue</button>
  </div>

  const form = isFomVisible && <IssueForm onSave={issue => handleCreateNewIssue(issue)} onClose={hideForm} selectedIssue={selectedIssue} />;

  //// Emtpy State
  if (stagedIssues?.length === 0) {
    return <div>
      {header}
      <ErrorPage fullpageError={FullPageError.NO_DATA} actionHandler={e => showForm(null)} />;
      {form}
    </div>
  }

  //// Data Handling

  const handleDeleteStagedIssue = (issue) => {
    incidentRepo.deleteRecord(issue.id);
  };

  const handleEditIssue = (issue) => {
    showForm(issue);
  };

  const rowUpdateAction = {
    title: '\u2715',
    actionHandler: (issue) => {
      handleDeleteStagedIssue(issue.id);
    }
  };

  const stagedIssuesPage = () => {
    return (
      <div>
        {header}
        <IssueTable issues={stagedIssues} onRowTap={handleEditIssue} rowUpdateAction={rowUpdateAction} />
        {form}
      </div>
    );
  };

  return stagedIssuesPage();
}

export default StagedIssuesTab;