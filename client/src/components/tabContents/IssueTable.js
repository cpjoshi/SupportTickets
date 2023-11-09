
import React, { useState } from 'react';

function IssueTable({ issues, rowUpdateAction, onRowTap }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  return (
    <table className="styled-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Image</th>
          { rowUpdateAction && <th>Action</th>}
        </tr>
      </thead>
     
      <tbody>
        {issues.map((issue) => (
          <tr key={issue.id} onClick={onRowTap == null ? undefined : () => onRowTap(issue)}>
            <td>{issue.description}</td>
            <td>{issue.priority}</td>
            <td>{issue.status}</td>
            <td>
              {issue.image && <img
                src={issue.image}
                alt="Issue"
                onClick={() => handleImageClick(issue.imageUrl)}
              />}
            </td>
            {
              rowUpdateAction && 
              <td onClick={(e) => {
                e.stopPropagation();
                rowUpdateAction.actionHandler(issue);
              }}>
              <button className='delete-button'>
                {rowUpdateAction.title} 
              </button>
                
            </td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default IssueTable;
