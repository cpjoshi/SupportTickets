// IssueForm.js
import * as microsoftTeams from '@microsoft/teams-js';
import React, { useState, useEffect } from 'react';
import '../style/IssueForm.css';

const IssueForm = ({ onSave, onClose, selectedIssue }) => {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    // If a selected issue is provided, populate the form fields
    if (selectedIssue) {
      setDescription(selectedIssue.description || '');
      setPriority(selectedIssue.priority || '');
      setStatus(selectedIssue.status || '');
      setImage(selectedIssue.image || null);
    }
  }, [selectedIssue]);

  const handleSave = () => {
    const updatedIssue = {
      id: selectedIssue ? selectedIssue.id : generateUniqueId(),
      description,
      priority,
      status,
      image
    };

    onSave(updatedIssue);
  };

  const generateUniqueId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  const selectImage = () => {
    microsoftTeams.media.selectMedia(
      {
        mediaType: microsoftTeams.media.MediaType.Image,
        maxMediaCount: 1,
        imageMaxWidth: 200,
        imageMaxHeight: 200
      },
      (error, attachments) => {
        if (error) {
          console.error('Error selecting image:', error);
          return;
        }

        if (attachments.length === 0) {
          console.log('No image attachment received');
          return;
        }

        const attachment = attachments[0];
        var src = "data:" + attachment.mimeType + ";base64," + attachment.preview;
        setImage(src);
      }
    );  
  };

  return (
    <div className="issue-form-container">
      
      <div className="issue-form-header">
        <h2>{selectedIssue ? 'Update Issue' : 'Create New Issue'}</h2>
        <button className="close-button" onClick={onClose}>
          &#10006;
        </button>
      </div>

      <div className="issue-form-body">
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="priority">Priority:</label>
        <input
          type="text"
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />

        <label htmlFor="status">Status:</label>
        <input
          type="text"
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />

        <div> 
        <label htmlFor="image">Image:</label>
        <button className="upload-button" onClick={(e) => selectImage(e.target.value)}>
          Pick Image
          </button>
          <image src={image} />
        </div>
      </div>
      <div className="form-footer">
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default IssueForm;
