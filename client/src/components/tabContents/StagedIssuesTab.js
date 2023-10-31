import React, {useState, useEffect} from 'react';

function StagedIssuesTab(props) {
    const [stagedIssues, setStagedIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);



  const handleDeleteStagedIssue = (issueId) => {
    // call parent 
  };

  const handleEditIssue = (issue) => {
    // call parent 
  };

  useEffect(() => {
    const storedStagedIssues = JSON.parse(localStorage.getItem('stagedIssues')) || [];
    setStagedIssues(storedStagedIssues);
  }, []);



    return (
     <div>
            <h2>Staged Issues</h2>
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
    );
}

export default StagedIssuesTab;
