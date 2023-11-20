import React, { useState, useEffect, useContext } from 'react';
import IssueForm from '../../forms/IssueForm';
import { FullPageError } from '../../models/ErrorModel';
import ErrorPage from '../ErrorPage';
import IssueTable from './IssueTable';
import IncidentRepository from '../../db/IncidentRepository';
import { TeamsContext } from '../../Main';

function StagedIssuesTab(props) {
  const [stagedIssues, setStagedIssues] = useState([]);
  const [syncingIssues, setSyncingIssues] = useState(new Set());
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isFomVisible, setFormVisibility] = useState(false);
  const [shouldRerender, setShouldRerender] = useState(false);
  const incidentRepo = new IncidentRepository();
  const teamsToken = useContext(TeamsContext).token;

  /// Form Visibility

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

  //// Actions

  const handleCreateNewIssue = (newIssue) => {
    let promise;
    if (selectedIssue) {
      promise = incidentRepo.updateRecordById(selectedIssue.id, newIssue);
    } else if (newIssue) {
      promise = incidentRepo.saveRecord(newIssue);
    }

    promise.then(() => {
      hideForm(true);
    });
  }

  const handleSync = async () => {
    // Iterate over stagedIssues and post each issue to "/api/issues"
    for (const stagedIssue of stagedIssues) {
      try {
        // Start syncing, add issue to syncingIssues
        setSyncingIssues((prevSyncingIssues) => new Set([...prevSyncingIssues, stagedIssue.id]));

        const response = await fetch('/api/issues', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${teamsToken}`,
          },
          body: JSON.stringify(stagedIssue),
        });

        if (response.ok) {
          // If successful, delete the issue from incidentRepo
          incidentRepo.deleteRecord(stagedIssue.id);
        } else {
          console.error(`Failed to sync issue ${stagedIssue.id}. Status: ${response.status}`);
        }
      } catch (error) {
        console.error(`Error syncing issue ${stagedIssue.id}:`, error);
      } finally {
        // Stop syncing, remove issue from syncingIssues
        setSyncingIssues((prevSyncingIssues) => {
          const newSyncingIssues = new Set(prevSyncingIssues);
          newSyncingIssues.delete(stagedIssue.id);
          return newSyncingIssues;
        });
      }
    }

    // Trigger a re-render to update the IssueTable
    setShouldRerender(!shouldRerender);
  };

  useEffect(() => {
    incidentRepo.getRecords().then((issues) => {
      setStagedIssues(issues);
    })
  }, [shouldRerender]);


  //// UI Elements

  const header = <div>
    <div className='hint-box'>
      <p> - Issues that have been created or updated but not yet saved.</p>
      <p> - Click on an issue to edit it.</p>
    </div>
    <br />
    <button onClick={e => showForm(null)}> Create New Issue</button>
    <button onClick={handleSync} style={{ float: 'right' }}> Sync</button>
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

  const handleDeleteStagedIssue = (issueId) => {
    incidentRepo.deleteRecord(issueId);
    setShouldRerender(!shouldRerender);
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
        <IssueTable issues={stagedIssues} onRowTap={e => showForm(e)} rowUpdateAction={rowUpdateAction} syncingIssues={syncingIssues} />
        {form}
      </div>
    );
  };

  return stagedIssuesPage();
}

export default StagedIssuesTab;